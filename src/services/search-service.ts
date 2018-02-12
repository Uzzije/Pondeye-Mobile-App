import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class SearchService {
  private chats: any;
  
  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
  }
  private platformUrl;
    getsearchResult  (queryWord) {
        console.log(queryWord , " searching!");
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-search-results?username=" 
        + username + "&query_word=" + queryWord + "&tag_search=" + ""))
            .map(this.processData).catch(this.processError);
    }
    getProjectResult  (queryWord) {
        console.log(queryWord , " searching!");
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-projects?username=" + username + "&query_word=" + queryWord))
            .map(this.processData).catch(this.processError);
    }
    getFriendResult  (queryWord) {
        console.log(queryWord , " searching!");
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-friends?username=" + username + "&query_word=" + queryWord))
            .map(this.processData)
            .catch(this.processError);
    }
    getTagResult  (queryWord) {
        console.log(queryWord , " searching!");
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-search-results?username=" 
        + username + "&query_word=" + queryWord + "&tag_search=" + true))
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

}