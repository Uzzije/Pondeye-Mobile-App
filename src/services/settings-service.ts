import { Injectable }  from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CURRENTURL} from './service-util/URLS'
import {TIMEZONE} from './service-util/timezone-local'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class SettingsService {
  private posts: any;

  constructor(private _http: Http) {
    this.platformUrl = CURRENTURL;
    this.timezone =  TIMEZONE;
  }
  private platformUrl;
  private timezone;

  getUserMilestoneData = function () {
        var timezone = localStorage.getItem("pondTimezone");
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/api/milestone-edit/?username=" + username + "&timezone=" + timezone))
            .map(this.processData).catch(this.processError);
    };
   getPersonalEditData = function () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/api/personal-info-edit/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
   getPictureEditData = function () {
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/picture-set-edit/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
   getPondEditData = function () {
        // Get pond data for editing pond
        var username = localStorage.getItem("username");
        return this._http.get(this.platformUrl + ("/social/api/pond-edit/?username=" + username))
            .map(this.processData).catch(this.processError);
    };
   getProjectEditData = function () {
        var username = localStorage.getItem("username");
        var timezone = localStorage.getItem("pondTimezone");
        return this._http.get(this.platformUrl + ("/api/project-edit/?username=" + username + "&timezone=" + timezone))
            .map(this.processData).catch(this.processError);
    };
   updateMilestone = function (milId, updated_name) {
        var username = localStorage.getItem("username");
        var timezone = localStorage.getItem("pondTimezone");
        var data = "username=" + username + "&updated_name=" + updated_name + "&timezone=" + timezone + "&update_milestone=" + milId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/milestone-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deleteMilestone = function (milId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&delete_milestone=" + milId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/milestone-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updateProject = function (projId, updatedName, tags) {
        var username = localStorage.getItem("username");
        var timezone = localStorage.getItem("pondTimezone");
        var data = "username=" + username + "&the_message=" + updatedName + "&timezone=" + timezone + "&update_project=" + projId + "&tags=" + tags;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/project-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deleteProject = function (projId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&proj_id=" + projId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/project-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updatePictureSetAfter = function (picId, picture_file) {
        var username = localStorage.getItem("username");
        var new_pic = encodeURIComponent(picture_file);
        var data = "username=" + username + "&change_picture_after=" + picId + "&picture=" + new_pic;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/picture-set-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updatePictureSetBefore = function (picId, picture_file) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&change_picture_before=" + picId + "&picture=" + picture_file;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/picture-set-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deletePictureSetBefore = function (picId, picture_file) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&delete_picture_before=" + picId + "&picture=" + picture_file;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/picture-set-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deletePictureSetAfter = function (picId, picture_file) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&delete_picture_after=" + picId + "&picture=" + picture_file;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/picture-set-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deletePictureSet = function (picSetId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pic_set_id=" + picSetId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/picture-set-delete/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   deletePondSet = function (pondId) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&pond_id=" + pondId;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/pond-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updateIndividualPondSet = function (pond_name, purpose, tags, ponders, pond_id) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&name_of_pond=" + pond_name + "&pond_id=" + pond_id + "&purpose=" + purpose + "&tags=" + tags + "&ponders=" + ponders;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/social/api/individual-pond/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updatedPersonalInfo = function (first_name, last_name, email) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&first_name=" + first_name + "&last_name=" + last_name + "&email=" + email + "&save_changes=" + true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/personal-info-edit/', data, { headers: headers })
            .map(this.processData).catch(this.processError);
    };
   updatedPersonalPassword = function (newPassword, old_password) {
        var username = localStorage.getItem("username");
        var data = "username=" + username + "&password=" + newPassword + "&old_password=" + old_password + "&save_password&=" + true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.platformUrl + '/api/personal-info-edit/', data, { headers: headers })
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
