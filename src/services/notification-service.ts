import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class NotificationService {
  private chats: any;
  
  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone = localStorage.getItem("pondTimezone");
  }
  private platformUrl;
  private timezone;

    getNotificationService = function () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-notification/?username=" + username + "&timezone=" + this.timezone))
            .map(this.processData).catch(this.processError);
    };
    backgroundNotificationService = function () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/notification-status/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
    checkProjectandMilestoneService = function () {
        var username = localStorage.getItem("username");
        var data = "username=" + username;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/check-proj-and-mil-failed/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };

    processData = function (res) {
        var body = JSON.stringify(res.json());
        console.log("body " + body);
        return body || {};
    };
    processError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof Response ) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg =  true ? error.message : error.toString() + "\Sorry! Please restart the app. Also check your connection!";
        }
        console.error(errMsg);
        return Observable.throw("Sorry! Something went wrong. Make sure you are connected to the internet.");
    };

}