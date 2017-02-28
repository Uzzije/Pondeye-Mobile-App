import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import {TIMEZONE} from './service-util/timezone-local'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class PostService {
  private posts: any;

  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private platformUrl;
  private timezone;

    getUserFeed  () {
        var headers = new Headers();
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/news-feed?username=" + username + "&timezone=" + this.timezone))
            .map(this.processData).catch(this.processError);
    };

    postNewFollow  (proj_id) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&proj_id=" + proj_id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + "/social/api/create-follow/", data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    postNewVouch  (mil_id) {
        console.log("the best id ", mil_id);
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&mil_id=" + mil_id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + "/social/api/create-vouch/", data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    getMilestonePost  (milID) {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/individual-milestone/?username=" + username + "&mil_id=" + milID + "&timezone=" + this.timezone))
            .map(this.processData).catch(this.processError);
    };
    getProjectPost  (projectID) {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/individual-project?username=" + username + "&proj_id=" + projectID + "&timezone=" + this.timezone))
            .map(this.processData).catch(this.processError);
    };
    postProjectNewSeen  (proj_id) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&proj_id=" + proj_id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + "/social/api/create-project-seen-count/", data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    postMilestoneNewSeen  (mil_id) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&mil_id=" + mil_id;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + "/social/api/create-milestone-seen-count/", data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
  processData  (res) {
        var body = JSON.stringify(res.json());
        console.log("body " + body);
        return body || {};
    };
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
    };

}
