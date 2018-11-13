var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { LoginPage } from "../login/login";
import { HomePage } from "../home/home";
var RegisterPage = /** @class */ (function () {
    function RegisterPage(nav) {
        this.nav = nav;
    }
    // register and go to home page
    RegisterPage.prototype.register = function () {
        this.nav.setRoot(HomePage);
    };
    // go to login page
    RegisterPage.prototype.login = function () {
        this.nav.setRoot(LoginPage);
    };
    RegisterPage = __decorate([
        Component({
            selector: 'page-register',
            templateUrl: 'register.html'
        }),
        __metadata("design:paramtypes", [NavController])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map