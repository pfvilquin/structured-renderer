/**
* Licensed to the Symphony Software Foundation (SSF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The SSF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
**/

// Create our own local controller service.
// We have namespaced local services with "hello:"
var helloControllerService = SYMPHONY.services.register("pwmDemo:controller");

// This is the message controller service, to be used for static and dynamic rendering
var messageControllerService = SYMPHONY.services.register("pwmDemoEntity:controller");

// All Symphony services are namespaced with SYMPHONY
SYMPHONY.remote.hello().then(function(data) {

    // Register our application with the Symphony client:
    // Subscribe the application to remote (i.e. Symphony's) services
    // Register our own local services
    SYMPHONY.application.register("pwmDemo", ["ui","entity"], ["pwmDemo:controller", "pwmDemoEntity:controller"]).then(function(response) {

        // The userReferenceId is an anonymized random string that can be used for uniquely identifying users.
        // The userReferenceId persists until the application is uninstalled by the user. 
        // If the application is reinstalled, the userReferenceId will change.
        var userId = response.userReferenceId;

        // Subscribe to Symphony's services
        // var modulesService = SYMPHONY.services.subscribe("modules");
        // var navService = SYMPHONY.services.subscribe("applications-nav");
        var uiService = SYMPHONY.services.subscribe("ui");
        // var shareService = SYMPHONY.services.subscribe("share");
        var entityService = SYMPHONY.services.subscribe("entity");
        entityService.registerRenderer(
            "com.symphony.fa",
            {},
            "pwmDemoEntity:controller"
        );

        // The list of entities to track for dynamic rendering each entity individually
        messageControllerService.tracked = {};

        // Implement some methods to render the structured objects sent by the app to our specified thread
        messageControllerService.implement({

            // Render the message sent by the app
            render: function(type, entityData) {
                var version = entityData.version;
                // Generate a id for each entity (unique enough for sampling purposes)
                // Consider how to translate uuids as list indexing for more robust id marking
                var instanceId = Math.floor(Math.random()*1000000);
                entityData.instanceId = instanceId;
                var renderTime = new Date();
                entityData.renderTime = renderTime;

                // Static rendering
                if(version == "1.0") {
                    return this.getTemplate(entityData);

                } 
            },

            // Render the template using the current timestamp and the specified date from entity data
            getTemplate: function(entityData) {
                var email = entityData.userEmail;
                var renderTime = entityData.renderTime;
                var current = new Date();
                var template;
                if( entityData.version === "1.0" ) {
                    template = `<messageML>
                    <hash tag="#tradeAlert"/>
                                  <iframe src="https://localhost:4000/app.html?email=`+email+`&amp;alert=true" height="400" width="300"></iframe>
                               </messageML>`
                } 
                return {
                    // Use a custom template to utilise data sent with the message in entityData in our messageML message
                    template: template
                }
            }
            
        });
    }.bind(this))
}.bind(this));