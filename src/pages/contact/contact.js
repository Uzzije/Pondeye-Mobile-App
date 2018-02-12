var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var core_1 = require('@angular/core');
var user_1 = require("../user/user");
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ContactPage = (function () {
    function ContactPage(nav, userService) {
        this.nav = nav;
        this.userService = userService;
    }
    // view contact
    ContactPage.prototype.viewContact = function (id) {
        this.nav.push(user_1.UserPage, { id: id });
    };
    ContactPage = __decorate([
        core_1.Component({
            selector: 'page-contact',
            templateUrl: 'contact.html'
        })
    ], ContactPage);
    return ContactPage;
})();
exports.ContactPage = ContactPage;
//# sourceMappingURL=contact.js.map