
var LIVEURL = 'http://pondeye-env-1.y4besq8x8g.us-west-1.elasticbeanstalk.com';
var LOCALURL = "http://localhost:8000";
var CURRENT_URL = LIVEURL;
var NOTIFICATIONCOUNTER = 150000;
var CHECKFAILEDCOUNTER = 100000;
var clickNotif = localStorage.getItem("clickNotif");
var type_of_device = '';
var notification_list = [];
var havntReadList = [];
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
            try{
                console.log(statusParse);
                var status = statusParse['data']["has_notification"];
                if (status == true){
                    data = statusParse['data']['notifications']
                    console.log("New Notification!");
                    //if(!localStorage.getItem("notifClicked")){
                        sendNotificationToUser(data);  
                        localStorage.setItem("notification_length", havntReadList.length);
                    //}
                }
                else{
                    //localStorage.setItem("seenNotif", "seen");
                    
                    localStorage.removeItem("notif");
                    console.log("No Notification!");
                }  
                if(havntReadList.length > 15){
                    havntReadList = [];
                }
                var tz = jstz.determine();
                localStorage.setItem("pondTimezone", tz.name());
                
                console.log("TimeZone", localStorage.getItem("pondTimezone"));
            }catch(e){
                console.log("Not logged in!");
            }
        },
        error: function(xhr){
            $("#error-message").text(xhr.responseText).show();
            clearInterval(check_notif_interval);
        }
    });
}


function sendNotificationToUser(data){
    
    console.log("sending push");
    var now = new Date().getTime();
    for(var i = 0; i < data.length; i++){
        _5_sec_from_now = new Date(now + 5 * 1000);

            // Schedule notification for tomorrow to remember about the meeting
            if(!havntReadList.includes(data[i])){
                havntReadList.push(data[i]);
                if(type_of_device === "Android"){
                    cordova.plugins.notification.local.schedule({
                        id: 10,
                        text: data[i],
                        at: _5_sec_from_now,
                        icon: "file://icon.png",
                        data: { }
                    });
                }else{
                        cordova.plugins.notification.local.schedule({
                        id: 10,
                        text: data[i],
                        at: _5_sec_from_now,
                        icon: "file://assets/icon/icon.png",
                        data: { }
                    });
            }
        }
    }   
}
 document.addEventListener('deviceready', function () {
        
    type_of_device = device.platform;
    console.log('Got device type ', type_of_device);
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