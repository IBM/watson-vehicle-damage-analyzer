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

const fs = require("fs");
const watson = require("watson-developer-cloud");
const express = require("express");
const application = express();
const formidable = require("formidable");
const vcapServices = require("vcap_services");
const credentials = vcapServices.getCredentials("watson_vision_combined");

const visual_recognition = watson.visual_recognition({
    api_key: credentials.api_key,
    version: "v3",
    version_date: "2016-05-20"
});
application.use(express.static(__dirname + "/public"));
application.post("/uploadpic", function (req, result) {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err);
        } else {
            console.log(fields);
            const filePath = JSON.parse(JSON.stringify(files));
            const params = {
                image_file: fs.createReadStream(filePath.myPhoto.path),
                classifier_ids: ["food"]
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
require("cf-deployment-tracker-client").track();
require("metrics-tracker-client").track();
