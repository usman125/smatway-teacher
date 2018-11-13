var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { HttpErrorResponse } from '@angular/common/http';
import { ClassesService } from '../../services/classes.service';
import { HomePage } from '../../pages/home/home';
var SelectClass = /** @class */ (function () {
    function SelectClass(navCtrl, _classesService, loadingController, storage) {
        this.navCtrl = navCtrl;
        this._classesService = _classesService;
        this.loadingController = loadingController;
        this.storage = storage;
        this.allClasses = [];
        this.loggedUser = null;
        this.loader = null;
    }
    SelectClass.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.presentLoading();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            console.log("LOCAL STORAGE FROM SELCT CLASS:---", _this.loggedUser);
            _this._classesService.allClassesByTeacherId(_this.loggedUser.teacher.id)
                .subscribe(function (result) {
                _this.allClasses = result.classes;
                console.log("ALL CLASSES OF TEACHER:---", _this.allClasses);
                _this.loader.dismissAll();
            });
        });
    };
    SelectClass.prototype.getClass = function (classobject) {
        // console.log("VALLUE FROM SLECTING CALSS:---\n", classobject);
        this.navCtrl.setRoot(HomePage, { 'classObject': classobject });
    };
    SelectClass.prototype.presentLoading = function () {
        this.loader = this.loadingController.create({
            content: 'loading…'
        });
        this.loader.present();
    };
    SelectClass = __decorate([
        Component({
            selector: 'select-class',
            templateUrl: 'selectclass.html',
            providers: [ClassesService]
        }),
        __metadata("design:paramtypes", [NavController,
            ClassesService,
            LoadingController,
            Storage])
    ], SelectClass);
    return SelectClass;
}());
export { SelectClass };
//# sourceMappingURL=selectclass.js.map