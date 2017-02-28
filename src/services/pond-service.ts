import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import {CURRENTURL} from './service-util/URLS'
import {TIMEZONE} from './service-util/timezone-local'


@Injectable()
export class PondService {

  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private platformUrl;
  private timezone;

    getListOfPonds  () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-ponds-data/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
    getIndividualPond  (pondId) {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/get-pond-data/?username=" + username + "&pond_id=" + pondId))
            .map(this.processData).catch(this.processError);
    };
    newPondEntry  (name_of_pond, purpose, tags) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&name_of_pond=" + name_of_pond + "&purpose=" + purpose + "&tags=" + tags;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/new-pond-entry/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    pondRequest  (pondId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pond_id=" + pondId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/pond-request/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    addUserToPond  (pondId, userId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pond_id=" + pondId + "&user_id=" + userId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/add-user-to-pond/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    denyUserFromPond  (pondRequestId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pond_request_id=" + pondRequestId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/deny-user-from-pond/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    acceptPondRequest  (pondRequestId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pond_request_id=" + pondRequestId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/accept-user-pond-request/', data, { headers: headers })
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
    }

}
