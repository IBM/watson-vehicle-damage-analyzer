/**
* Copyright 2017 IBM Corp. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/

/*jslint node: true*/
/*jslint es6 */
"use strict";

require("dotenv").config({
    silent: true
});

const fs = require("fs");
const VisualRecognitionV3 = require("watson-developer-cloud/visual-recognition/v3");
const express = require("express");
const application = express();
const formidable = require("formidable");
const WatsonVisRecSetup= require('./lib/watson-visRec-setup');

const visual_recognition = new VisualRecognitionV3({
    version: "2018-03-19"
});

var custom_classifier = null;

// setupError will be set to an error message if we cannot recover from service setup or init error.
let setupError = '';

const visRecSetup = new WatsonVisRecSetup(visual_recognition);
const visRecSetupParams = {
  "classifiers": [
    {
      "classifier_id": "",
      "name": "vehicleDamageAnalyzer",
      "status": "ready"
    }
  ]
};

visRecSetup.setupVisRec(visRecSetupParams, (err, data) => {
  if (err) {
    handleSetupError(err);
  } else {
    console.log('Visual Recognition is ready!');
    console.log('vehicleDamageAnalyzer classifier_id: ' + data.classifier_id);
    custom_classifier = data.classifier_id;
  }
});

/**
 * Handle setup errors by logging and appending to the global error text.
 * @param {String} reason - The error message for the setup error.
 */
function handleSetupError(reason) {
  setupError += ' ' + reason;
  console.error('The app failed to initialize properly. Setup and restart needed.' + setupError);
  // For testing allow the app to run. It would just report the above error.
  // Or we can add the following 2 lines to abort on a setup error allowing Bluemix to restart it.
  console.error('\nAborting due to setup error!');
  process.exit(1);
}

application.use(express.static(__dirname + "/public"));
application.post("/uploadpic", function (req, result) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        } else {
            const filePath = JSON.parse(JSON.stringify(files));
            const params = {
                image_file: fs.createReadStream(filePath.myPhoto.path),
                classifier_ids: [custom_classifier] || "",
                threshold: 0
            };
            visual_recognition.classify(params, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    const labelsvr = JSON.parse(JSON.stringify(res)).images[0].classifiers[0];
                    result.send({data: labelsvr});
                }
            });
        }
    });
});
const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

application.listen(port, function () {
    console.log("Server running on port: %d", port);
});
