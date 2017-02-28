
var LIVEURL = "http://Uzzije.pythonanywhere.com";
var LOCALURL = "http://localhost:8000";
var CURRENT_URL = LIVEURL;
var NOTIFICATIONCOUNTER = 150000;
var CHECKFAILEDCOUNTER = 100000;
var clickNotif = localStorage.getItem("clickNotif");
notificationReminder();
$(document).ready(function() {
    notificationReminder();
    console.log("I am ready! to load");
});
/*
function checkFailedProjectsMilestones(){
    $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}'}
    });
    $.ajax({
        url: CURRENT_URL+'/api/check-proj-and-mil-failed/',
        type: "POST",
        data: {username:localStorage.getItem("username")},
        success: function(response){
            var statusParse = JSON.parse(response);
            var status = statusParse["status"];
            if (status == true){
                console.log("successfully sent seen failed checkedFaileds")
            }
            else{
                console.log("something happened");
            }
             var tz = jstz.determine();
            localStorage.setItem("pondTimezone", tz.name());
            console.log("TimeZone", localStorage.getItem("pondTimezone"));
        },
        error: function(xhr){
            $("#error-message").text(xhr.responseText).show();
            clearInterval(check_failed_interval);
        }
    });
}
*/

function notificationReminder(){
    $.ajaxSetup({
        data: {csrfmiddlewaretoken: '{{ csrf_token }}'}
    });
    $.ajax({
        url: CURRENT_URL+'/social/api/notification-status/',
        type: "GET",
        data: {username:localStorage.getItem("username")},
        success: function(response){
            var statusParse = JSON.parse(response);
            var status = statusParse["status"];
            if (status == true){
                console.log("New Notification!");
                if(!localStorage.getItem("notifClicked")){
                    sendNotificationToUser();  
                    localStorage.setItem("notifClicked", "New");
                    console.log(localStorage.getItem("notifClicked", "New"));
                }
            }
            else{
                //localStorage.setItem("seenNotif", "seen");
                
                localStorage.removeItem("notif");
                console.log("No Notification!");
            }  
            var tz = jstz.determine();
            localStorage.setItem("pondTimezone", tz.name());
            console.log("TimeZone", localStorage.getItem("pondTimezone"));
        },
        error: function(xhr){
            $("#error-message").text(xhr.responseText).show();
            clearInterval(check_notif_interval);
        }
    });
}


function sendNotificationToUser(){
    
    console.log("sending push");
    var now = new Date().getTime();
    _5_sec_from_now = new Date(now + 5 * 1000);
        // Schedule notification for tomorrow to remember about the meeting
        if(device.platform === "Android"){
            cordova.plugins.notification.local.schedule({
                id: 10,
                text: "New Notification!",
                at: _5_sec_from_now,
                icon: "assets/icon/icon.png",
                data: { }
            });
        }else{
                cordova.plugins.notification.local.schedule({
                id: 10,
                text: "New Notification!",
                at: _5_sec_from_now,
                icon: "file://assets/icon/icon.png",
                data: { }
            });
        }
           
}
 document.addEventListener('deviceready', function () {
        
            
    // Join BBM Meeting when user has clicked on the notification 
    cordova.plugins.notification.local.on("click", function () {
        console.log("clicked on notifications");
        localStorage.removeItem("notifClicked");
    });

    // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    cordova.plugins.notification.local.on("trigger", function () {
        console.log("Notification has been triggered!")
    });
}, false);

//var check_failed_interval = setInterval(checkFailedProjectsMilestones, CHECKFAILEDCOUNTER);
var check_notif_interval = setInterval(notificationReminder, NOTIFICATIONCOUNTER);