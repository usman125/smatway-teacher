var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Events } from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { SelectClass } from "../pages/selectclass/selectclass";
import { LoginPage } from "../pages/login/login";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";
import { Storage } from '@ionic/storage';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, Events, _storage, keyboard) {
        var _this = this;
        this.platform = platform;
        this.statusBar = statusBar;
        this.Events = Events;
        this._storage = _storage;
        this.keyboard = keyboard;
        this.rootPage = LoginPage;
        this.loggedUser = null;
        //*** Control Status Bar
        this.appMenuItems = [
            // {title: 'Home', component: HomePage, icon: 'home'},
            { title: 'Account', component: LocalWeatherPage, icon: 'contact' }
        ];
        Events.subscribe('user:created', function (user, time) {
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log('Welcome', user, 'at', time);
            _this.loggedUser = user;
            if (_this.appMenuItems.length < 2)
                _this.appMenuItems.push({ title: 'Select Class', component: SelectClass, icon: 'people' });
        });
        this.initializeApp();
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            _this.statusBar.styleDefault();
            _this.statusBar.overlaysWebView(false);
            // this.getUser()
            //*** Control Splash Screen
            // this.splashScreen.show();
            // this.splashScreen.hide();
            //*** Control Keyboard
            // this.keyboard.disableScroll(true);
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.logout = function () {
        this._storage.remove('user');
        // window.location.reload
        this.nav.setRoot(LoginPage);
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform,
            StatusBar,
            Events,
            Storage,
            Keyboard])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map