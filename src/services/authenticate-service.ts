import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import {TIMEZONE} from './service-util/timezone-local'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class AuthenticateService {
  private posts: any;

  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private platformUrl;
  private timezone;
  private edusername = false;
  private edemail = false;
  private edfirst_name = false;
  private edlast_name = false;
  private edpassword = false;
  private edconf_password = false;


    authenticate = function (username, password) {
        var data = "username=" + username + "&password=" + password;
        console.log("data: " + data);
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/login/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };

    regAuthenticate = function (username, password, conf_password, email, first_name, last_name) {
        var data = "username=" + username + "&password=" + password + "&email=" + email + "&first_name=" + first_name + "&last_name=" + last_name;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/register/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    passwordResetService = function (email, newPassword, passToken) {
        console.log("emai ", email);
        var data = "token=" + passToken + "&password=" + newPassword + "&email=" + email;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/reset-password/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
    sendActivationCode = function (email) {
        var data = "email=" + email;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/send-reset-pass-code/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };

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
