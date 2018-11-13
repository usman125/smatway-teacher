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
import { NavController, NavParams, ModalController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AssignmentsService } from '../../services/assignment.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
var StudentPerformance = /** @class */ (function () {
    function StudentPerformance(navCtrl, navParams, _formBuilder, modalCtrl, _assignmentsService, loadingCtrl, toastCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._formBuilder = _formBuilder;
        this.modalCtrl = modalCtrl;
        this._assignmentsService = _assignmentsService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.loggedUser = null;
        this.loader = null;
        this.existFlag = false;
        this._buildPerformanceForm();
    }
    StudentPerformance.prototype._buildPerformanceForm = function () {
        this.performanceForm = this._formBuilder.group({
            response: new FormControl(0, Validators.required),
            writing: new FormControl(0, Validators.required),
            listening: new FormControl(0, Validators.required),
            speaking: new FormControl(0, Validators.required),
            reading: new FormControl(0, Validators.required)
        });
    };
    StudentPerformance.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.presentLoading();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.selectedStudent = _this.navParams.get('student');
            console.log("LOCAL STORAGE FROM SINGLE STUDENTS:---\n", _this.loggedUser, "\nSTUDENT FROM PARAMS:---\n", _this.selectedStudent);
            _this._assignmentsService.getOverallPerformance(_this.selectedStudent.id)
                .subscribe(function (result) {
                console.log("OVERALL PERFORMANCE FROM GET:---", result);
                if (result.status) {
                    _this.performanceForm.setValue({ 'response': result.student.response,
                        'writing': result.student.writing,
                        'listening': result.student.listening,
                        'speaking': result.student.speaking,
                        'reading': result.student.reading, }, { onlySelf: true });
                }
                _this.loader.dismissAll();
            });
        });
    };
    StudentPerformance.prototype.presentProfileModal = function () {
        var profileModal = this.modalCtrl.create(Profile, { 'student': this.selectedStudent });
        profileModal.present();
    };
    StudentPerformance.prototype.submitPeformance = function (values) {
        var _this = this;
        console.log("VALUES FROM PERFORMANCE:--\n", values);
        var performance = {
            'studentId': this.selectedStudent.id,
            'response': values.response,
            'writing': values.writing,
            'listening': values.listening,
            'speaking': values.speaking,
            'reading': values.reading,
        };
        this.presentLoading();
        this._assignmentsService.markOverallPerformance(performance)
            .subscribe(function (result) {
            console.log("RESULT FROM ADDING OVERALL PERFORMANCE:---", result);
            _this.presentToast(result.message);
            _this.loader.dismissAll();
        });
    };
    StudentPerformance.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    StudentPerformance.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: 'loading…'
        });
        this.loader.present();
    };
    StudentPerformance = __decorate([
        Component({
            selector: 'student-performance',
            templateUrl: 'studentperformance.html',
            providers: [AssignmentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            FormBuilder,
            ModalController,
            AssignmentsService,
            LoadingController,
            ToastController,
            Storage])
    ], StudentPerformance);
    return StudentPerformance;
}());
export { StudentPerformance };
var Profile = /** @class */ (function () {
    function Profile(navParams, viewCtrl) {
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.selectedStudent = null;
        // console.log('UserId', navParams.get('userId'));
        this.selectedStudent = navParams.get('student');
    }
    Profile.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    Profile = __decorate([
        Component({
            selector: 'student-performance',
            template: "\n  <ion-header>\n    <ion-navbar>\n      <ion-buttons start class=\"m-t-10\">\n        <button (click)=\"dismiss()\" style=\"margin-right:10px;\">\n          <ion-icon name='close'></ion-icon>\n        </button>\n      </ion-buttons>\n      <ion-title class=\"m-t-10\">\n        Student Profile\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n  <ion-content>\n    <ion-card>\n      <ion-row>\n        <ion-col col-12>\n          <img src=\"{{selectedStudent?.imageUrl}}\">\n        </ion-col>\n        <ion-col col=12 class=\"info-box\">\n          <div class=\"header-title-alt\">student information</div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Name </span>\n            <span id=\"name-value\"> {{selectedStudent?.name}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">School Name </span>\n            <span id=\"name-value\"> {{selectedStudent?.schoolName}}</span>\n          </div>\n\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">School Reg. Number</span>\n            <span id=\"name-value\"> {{selectedStudent?.schoolIdentityNo}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Address </span>\n            <span id=\"name-value\"> {{selectedStudent?.address}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Nationality </span>\n            <span id=\"name-value\"> {{selectedStudent?.nationality}}</span>\n          </div>\n\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Registration Date </span>\n            <span id=\"name-value\"> {{selectedStudent?.registrationDate | date:'fullDate'}}</span>\n          </div>\n\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Passport #</span>\n            <span id=\"name-value\"> {{selectedStudent?.passportNo}}</span>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-card>\n\n    <ion-card>\n      <ion-row>\n        <ion-col col=12 class=\"info-box\">\n          <div class=\"header-title-alt\">parent information</div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Name </span>\n            <span id=\"name-value\"> {{selectedStudent?.studentParent.name}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Relation With Student </span>\n            <span id=\"name-value\"> {{selectedStudent?.studentParent.relationWithStudent}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Address </span>\n            <span id=\"name-value\"> {{selectedStudent?.studentParent.address}}</span>\n          </div>\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Nationality </span>\n            <span id=\"name-value\"> {{selectedStudent?.studentParent.nationality}}</span>\n          </div>\n\n          <div class=\"box\">\n            <span id=\"name\" class=\"text-secondary\">Passport #</span>\n            <span id=\"name-value\"> {{selectedStudent?.studentParent.passportNo}}</span>\n          </div>\n        </ion-col>\n      </ion-row>\n    </ion-card>\n  </ion-content>"
        }),
        __metadata("design:paramtypes", [NavParams,
            ViewController])
    ], Profile);
    return Profile;
}());
export { Profile };
//# sourceMappingURL=studentperformance.js.map