/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var config;
var apiURL;
var appId;
var appKey;

document.addEventListener("deviceready",onDevice, false);
function onDevice(){
    document.getElementById("captureImage").addEventListener("click",captureImages);
    $.getJSON("config.json",function(data){
           format: "json"
        }).done(function(data){
          config = data;
          console.log(config);
            apiURL = config.SERVER_URL;
        });
    var win = function (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
//Watson Visual Recognition response display
    var Response =  JSON.parse(r.response);
    var optitle ="<h2>Watson sees..</h2>";
    document.getElementById("optitle").innerHTML = optitle;
            var html ="<table border='1|1'>";
                html+="<tr>";
                html+="<th>Class</th>";
                html+="<th>Confidence score</th>";
                html+="</tr>";
                for (var i = 0; i < Response.data.classes.length; i++) {
                html+="<tr>";
                html+="<td>"+Response.data.classes[i].class+"</td>";
                html+="<td>"+Response.data.classes[i].score+"</td>";
                html+="</tr>";
                }
                html+="</table>";
                document.getElementById("labels").innerHTML = html;
                var resultDamage = Response.data.classes[0].class;
                console.log(resultDamage);
    }
    var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
    }
//Image Capture
    function captureImages(){
        navigator.camera.getPicture(onSuccess,onFail,{
            quality:50,
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.JPEG
   });
   function onSuccess(imageData) {
        var image = document.getElementById("myPhoto");
        image.src = imageData;
        var options = new FileUploadOptions();
        options.fileKey = "myPhoto";
        options.fileName = imageData.substr(imageData.lastIndexOf("/") + 1);
        options.mimeType="image/jpeg";
        options.chunkedMode = false;
        var ft = new FileTransfer();
        apiURL = apiURL.replace(/\/$/, "");
        ft.upload(imageData,encodeURI(apiURL + "/" + "uploadpic"), win, fail, options);
        }
   function onFail(message) {
      alert("Failed because: " + message);
   }
   }
}
