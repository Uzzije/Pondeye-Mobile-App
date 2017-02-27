import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import {TIMEZONE} from './service-util/timezone-local'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class UserService {

  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private platformUrl;
  private timezone;

   getUserInformation = function (userId) {
        var username = localStorage.getItem("username");
        var user;
        return this._http.get(this.platformUrl + ("/api/profile-view/?username=" + username + "&other_user_id=" + userId))
            .map(this.processData).catch(this.processError);
   }

   markProjectDone = function (projId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&&proj_id=" + projId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/project-marked-done/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    }

   markMilestoneDone = function (milId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&mil_id=" + milId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/milestone-marked-done/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    }

    processData = function (res) {
        var body = JSON.stringify(res.json());
        console.log("body " + body);
        return body || {};
    }
    processError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof  Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg =  true ? error.message : error.toString() + "\Sorry! Please restart the app. Also check your connection!";
        }
        console.error(errMsg);
        return Observable.throw("Sorry! Something went wrong. Make sure you are connected to the internet.");
    }

}
