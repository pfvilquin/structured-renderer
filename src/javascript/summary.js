var helloAppService = SYMPHONY.services.register("hello:app");


var $ = require('jquery');
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}
var email = $.urlParam('email'); 


SYMPHONY.remote.hello().then(function(data) {

    // Set the theme of the app module
    var themeColor = data.themeV2.name;
    var themeSize = data.themeV2.size;
    // You must add the symphony-external-app class to the body element
    document.body.className = "symphony-external-app " + themeColor + " " + themeSize;

    SYMPHONY.application.connect("pwmDemo", ["ui"], ["pwmDemo:app"]).then(function(response) {

        // The userReferenceId is an anonymized random string that can be used for uniquely identifying users.
        // The userReferenceId persists until the application is uninstalled by the user. 
        // If the application is reinstalled, the userReferenceId will change.
        var userId = response.userReferenceId;
        
        // Subscribe to Symphony's services
        var uiService = SYMPHONY.services.subscribe("ui");
        //var shareService = SYMPHONY.services.subscribe("share");



        // UI: Listen for theme change events
        uiService.listen("themeChangeV2", function() {
            SYMPHONY.remote.hello().then(function(theme) {
                themeColor = theme.themeV2.name;
                themeSize = theme.themeV2.size;
                document.body.className = "symphony-external-app " + themeColor + " " + themeSize;
            });
        });

        var linkButton = document.getElementById("confirm");
        linkButton.addEventListener("click", function(){
            //add code to send a notification to a streamId using the TradeAlertBot
            location.href = "app.html?email="+email+"&alert=false";
              
        });
    }.bind(this))
}.bind(this));
