var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AddStudentActivity } from "../addstudentactivity/addstudentactivity";
import { AssignmentsService } from '../../services/assignment.service';
import { StreamingMedia } from '@ionic-native/streaming-media';
var StudentActivity = /** @class */ (function () {
    function StudentActivity(navCtrl, navParams, _assignmentsService, loadingController, streamingMedia, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._assignmentsService = _assignmentsService;
        this.loadingController = loadingController;
        this.streamingMedia = streamingMedia;
        this.storage = storage;
        this.loggedUser = null;
        this.allActivites = null;
        this.loader = null;
    }
    StudentActivity.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.presentLoading();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.selectedStudent = _this.navParams.get('student');
            console.log("LOCAL STORAGE FROM STUDENT ACTIVITY:---\n", _this.loggedUser, "\nSTUDENT FROM PARAMS:---\n", _this.selectedStudent);
            _this._assignmentsService.allActivitiesByStudentId(_this.selectedStudent.id)
                .subscribe(function (result) {
                console.log("RESULT FROM ALL ACTIVITIES:---", result.activities);
                _this.allActivites = result.activities;
                _this.loader.dismissAll();
            });
        });
    };
    StudentActivity.prototype.addActivity = function () {
        this.navCtrl.push(AddStudentActivity, { 'student': this.selectedStudent });
    };
    StudentActivity.prototype.playVideo = function (video) {
        console.log("VIDEO TO PLAY:---\n", video.url);
        var videoSrc = this.myVideo.nativeElement;
        var options = {
            successCallback: function () { console.log('Video played'); },
            errorCallback: function (e) { console.log('Error streaming'); },
            orientation: 'landscape'
        };
        videoSrc.src = video.url;
        this.streamingMedia.playVideo(video.url, options);
    };
    StudentActivity.prototype.presentLoading = function () {
        this.loader = this.loadingController.create({
            content: 'loading…'
        });
        this.loader.present();
    };
    __decorate([
        ViewChild('myvideo'),
        __metadata("design:type", Object)
    ], StudentActivity.prototype, "myVideo", void 0);
    StudentActivity = __decorate([
        Component({
            selector: 'student-activity',
            templateUrl: 'studentactivity.html',
            providers: [AssignmentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AssignmentsService,
            LoadingController,
            StreamingMedia,
            Storage])
    ], StudentActivity);
    return StudentActivity;
}());
export { StudentActivity };
//# sourceMappingURL=studentactivity.js.map