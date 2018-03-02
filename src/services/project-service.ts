import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import {TIMEZONE} from './service-util/timezone-local'

@Injectable()
export class ProjectService {
  private chats: any;
  
  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private timezone;
  private platformUrl;
    getAllProjects(userID, publicSearch) {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/tasks/api/get-all-challenge?username=" + username 
        + "&userId=" + userID + "&public_projects=" + publicSearch))
            .map(this.processData).catch(this.processError);
    }
    processData  (res) {
        var body = JSON.stringify(res.json());
        console.log("body " + body);
        return body || {};
    }
    processError  (error) {
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
    getChallengeRequest(){
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/tasks/api/challenge-request?username=" + username 
        + "&timezone="+this.timezone))
            .map(this.processData).catch(this.processError);
    }
    acceptChallengeRequest(reqId){
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&ch_Id=" + reqId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/accept-challenge-request/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    }
    rejectChallengeRequest(reqId){
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&ch_Id=" + reqId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/reject-challenge-request/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    }

}