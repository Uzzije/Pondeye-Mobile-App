import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


@Injectable()
export class NewPostServices {
  private chats: any;
  
  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone = localStorage.getItem("pondTimezone");
  }
  private platformUrl;
  private timezone;

    getNewPostData  () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/api/get-new-post-info/?username=" + username))
            .map(this.processData).catch(this.processError);
    }
    postNewProject  (name_of_project, public_status, milestone_date, tags, videoData) {
        var username = localStorage.getItem("username");
        var new_vid = encodeURIComponent(videoData);
        var data = "username=" + username + "&timezone=" + this.timezone + "&name_of_project=" + 
        name_of_project + "&public_status=" + public_status + "&milestone_date=" + milestone_date + "&tags=" + tags + "&projectvid="+new_vid;
        var headers = new  Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/create-new-project/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    }
    postNewMilestone  (milestone_name, name_of_mil_proj, length_of_time, milestone_date) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&timezone=" + this.timezone + "&milestone_name=" + milestone_name + "&name_of_mil_proj=" + name_of_mil_proj + "&length_of_time=" + length_of_time + "&milestone_date=" + milestone_date;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/create-new-milestone/', data, { headers: headers })
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