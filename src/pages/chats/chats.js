var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var core_1 = require('@angular/core');
var chat_detail_1 = require("../chat-detail/chat-detail");
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ChatsPage = (function () {
    function ChatsPage(nav, chatService) {
        this.nav = nav;
        this.chatService = chatService;
        // get sample data only
        this.chats = chatService.getAll();
    }
    // view chat detail
    ChatsPage.prototype.viewChat = function (id) {
        this.nav.push(chat_detail_1.ChatDetailPage, { id: id });
    };
    ChatsPage = __decorate([
        core_1.Component({
            selector: 'page-chats',
            templateUrl: 'chats.html'
        })
    ], ChatsPage);
    return ChatsPage;
})();
exports.ChatsPage = ChatsPage;
//# sourceMappingURL=chats.js.map