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
import { NavController, Events, AlertController, ToastController, MenuController } from "ionic-angular";
import { HomePage } from "../home/home";
import { RegisterPage } from "../register/register";
import { SelectClass } from "../selectclass/selectclass";
import { LoginService } from '../../services/login.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
var LoginPage = /** @class */ (function () {
    function LoginPage(nav, forgotCtrl, menu, Events, _formBuilder, _loginService, _storage, toastCtrl) {
        this.nav = nav;
        this.forgotCtrl = forgotCtrl;
        this.menu = menu;
        this.Events = Events;
        this._formBuilder = _formBuilder;
        this._loginService = _loginService;
        this._storage = _storage;
        this.toastCtrl = toastCtrl;
        this.loggedUser = null;
        this.menu.swipeEnable(false);
        this._buildLoginForm();
        // this._storage.remove('user')
    }
    LoginPage.prototype._buildLoginForm = function () {
        this.loginForm = this._formBuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    };
    // go to register page
    LoginPage.prototype.register = function () {
        this.nav.setRoot(RegisterPage);
    };
    // login and go to home page
    LoginPage.prototype.login = function () {
        this.nav.setRoot(HomePage);
    };
    LoginPage.prototype.checkLogin = function (values) {
        var _this = this;
        this._loginService.checkLogin(values.username, values.password)
            .subscribe(function (result) {
            // console.log("VALUES FROM LOGIN:---\n", values)
            if (result.status) {
                _this.loggedUser = result.user;
                if (_this.loggedUser.roleId === parseInt('3')) {
                    _this.loggedUser.role = 'teacher';
                }
                _this.loggedUser.schoolId = _this.loggedUser.teacher.schoolId;
                _this._storage.set('user', JSON.stringify(_this.loggedUser));
                console.log("RESULT FROM LOGIN:---\n", _this.loggedUser, _this._storage.get('user').then(function (val) {
                    console.log('Your STOREAGE ITEM IS:---\n', JSON.parse(val));
                }));
                _this.nav.setRoot(SelectClass);
                _this.Events.publish('user:created', _this.loggedUser, Date.now());
                var toast = _this.toastCtrl.create({
                    message: 'Your were successfully Logged In',
                    // showCloseButton: true,
                    // closeButtonText: 'Ok',
                    duration: 3000
                });
                toast.present();
            }
            else {
                var toast = _this.toastCtrl.create({
                    message: "" + result.message,
                    duration: 3000
                    // showCloseButton: true,
                    // closeButtonText: 'Ok'
                });
                toast.present();
            }
        });
    };
    LoginPage.prototype.forgotPass = function () {
        var _this = this;
        var forgot = this.forgotCtrl.create({
            title: 'Forgot Password?',
            message: "Enter you email address to send a reset link password.",
            inputs: [
                {
                    name: 'email',
                    placeholder: 'Email',
                    type: 'email'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Send',
                    handler: function (data) {
                        console.log('Send clicked');
                        var toast = _this.toastCtrl.create({
                            message: 'Email was sended successfully',
                            duration: 3000,
                            position: 'top',
                            cssClass: 'dark-trans',
                            closeButtonText: 'OK',
                            showCloseButton: true
                        });
                        toast.present();
                    }
                }
            ]
        });
        forgot.present();
    };
    LoginPage = __decorate([
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
            providers: [LoginService]
        }),
        __metadata("design:paramtypes", [NavController,
            AlertController,
            MenuController,
            Events,
            FormBuilder,
            LoginService,
            Storage,
            ToastController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map