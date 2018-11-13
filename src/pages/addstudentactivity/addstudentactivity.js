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
import { Storage } from '@ionic/storage';
import { ClassAttendanceService } from '../../services/classattendance.service';
import { AssignmentsService } from '../../services/assignment.service';
import { NavController, LoadingController, ToastController, Platform, NavParams, ViewController, ActionSheetController, AlertController } from 'ionic-angular';
import { FileTransfer, } from '@ionic-native/file-transfer';
import { Camera, } from '@ionic-native/camera';
import { Transfer, } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture } from '@ionic-native/media-capture';
import { StreamingMedia } from '@ionic-native/streaming-media';
import * as moment from 'moment';
var AddStudentActivity = /** @class */ (function () {
    function AddStudentActivity(navCtrl, navParams, platform, viewCtrl, alertController, _classAttendanceService, _assignmentsService, transfer, camera, loadingCtrl, toastCtrl, streamingMedia, fileChooser, mediaCapture, _transfer, actionSheetCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.platform = platform;
        this.viewCtrl = viewCtrl;
        this.alertController = alertController;
        this._classAttendanceService = _classAttendanceService;
        this._assignmentsService = _assignmentsService;
        this.transfer = transfer;
        this.camera = camera;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.streamingMedia = streamingMedia;
        this.fileChooser = fileChooser;
        this.mediaCapture = mediaCapture;
        this._transfer = _transfer;
        this.actionSheetCtrl = actionSheetCtrl;
        this.storage = storage;
        this.loggedUser = null;
        this.student = null;
        this.imageURI = null;
        this.imageFileName = null;
        this.imageFileName1 = null;
        this.imageFileName2 = null;
        this.uriType = null;
        this.flag_upload = true;
        this.flag_play = true;
    }
    AddStudentActivity.prototype.ionViewWillEnter = function () {
        var _this = this;
        var created_at = this.getDate();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.student = _this.navParams.get('student');
            console.log("LOCAL STORAGE FROM ADD ASSIGNMENT:---\n", _this.loggedUser, "\nSDTUENT:---\n", _this.student);
        });
    };
    AddStudentActivity.prototype.getGalleryImage = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.imageURI = imageData;
            console.log("IMAGE URI:--\n", _this.imageURI);
        }, function (err) {
            console.log(err);
            _this.presentToast(err);
        });
    };
    AddStudentActivity.prototype.getCameraImage = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.imageURI = imageData;
            console.log("IMAGE URI:--\n", _this.imageURI);
        }, function (err) {
            console.log(err);
            _this.presentToast(err);
        });
    };
    AddStudentActivity.prototype.uploadFile = function () {
        var _this = this;
        // let loader = this.loadingCtrl.create({
        //   content: "Uploading..."
        // });
        // loader.present();
        this.presentLoading();
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'file',
            fileName: 'ionicfile',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: { 'type': 'image', 'studentId': this.student.id, 'Extension': '.jpg' }
        };
        fileTransfer.upload(this.imageURI, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options)
            .then(function (data) {
            var image = JSON.parse(data.response);
            _this.imageFileName = image.activity.url;
            _this.loader.dismissAll();
            _this.presentToast("Image uploaded successfully");
            console.log(data.response + " Uploaded Successfully" + _this.imageFileName);
            _this.imageURI = null;
        }, function (err) {
            console.log(err);
            _this.loader.dismissAll();
            _this.presentToast(err);
            alert(err);
        });
    };
    AddStudentActivity.prototype.presentImageUploadSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: '‘Select Image Source',
            buttons: [{
                    text: '‘Load from Gallery’',
                    handler: function () {
                        _this.getGalleryImage();
                    }
                },
                {
                    text: '‘Use Camera’',
                    handler: function () {
                        _this.getCameraImage();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        actionSheet.present();
    };
    AddStudentActivity.prototype.presentVideoUploadSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: '‘Select Video Source',
            buttons: [{
                    text: '‘Load from Gallery’',
                    handler: function () {
                        _this.getVideo();
                    }
                },
                {
                    text: '‘Use Camera’',
                    handler: function () {
                        _this.capturevideo();
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        actionSheet.present();
    };
    AddStudentActivity.prototype.getVideo = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            _this.videoId = uri;
            _this.flag_play = false;
            _this.flag_upload = false;
        })
            .catch(function (e) { return console.log(e); });
    };
    AddStudentActivity.prototype.capturevideo = function () {
        var _this = this;
        var options = { limit: 1 };
        this.mediaCapture.captureVideo(options).then(function (videodata) {
            var i, path, len;
            for (i = 0, len = videodata.length; i < len; i += 1) {
                path = videodata[i].fullPath;
                // do something interesting with the file
            }
            _this.videoId = path;
            _this.flag_play = false;
            _this.flag_upload = false;
        });
    };
    AddStudentActivity.prototype.uploadVideo = function () {
        var _this = this;
        var fileTransfer = this.transfer.create();
        var video = this.myVideo.nativeElement;
        var options1 = {
            fileKey: 'video',
            fileName: this.videoId,
            headers: {},
            mimeType: 'multipart/form-data',
            params: { 'type': 'video', 'studentId': this.student.id, 'Extension': '.mp4' },
            chunkedMode: true
        };
        this.presentLoading();
        fileTransfer.upload(this.videoId, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options1)
            .then(function (data) {
            console.log('SUCCESSFULLY ADDED VIDEO****' + JSON.stringify(data.response));
            _this.loader.dismissAll();
            var result = JSON.parse(data.response);
            video.src = result.activity.url;
            _this.videoId = null;
            _this.flag_upload = true;
            _this.presentToast('Video is uploaded Successfully!');
        }, function (err) {
            alert('error' + JSON.stringify(err));
        });
    };
    AddStudentActivity.prototype.playVideo = function () {
        var _this = this;
        var options = {
            successCallback: function () { _this.flag_upload = true; console.log('Video played'); },
            errorCallback: function (e) { console.log('Error streaming'); },
            orientation: 'landscape'
        };
        this.streamingMedia.playVideo(this.videoId, options);
    };
    AddStudentActivity.prototype.presentToast = function (msg) {
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
    AddStudentActivity.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: 'Uploading…'
        });
        this.loader.present();
    };
    AddStudentActivity.prototype.getDate = function () {
        var day = new Date().getDate();
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var fullDate = null;
        var attendanceStudents = [];
        if (month + 1 < 10) {
            fullDate = year + '-0' + (month + 1) + '-' + day;
        }
        else {
            fullDate = year + '-' + (month + 1) + '-' + day;
        }
        var created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
        return created_at;
    };
    __decorate([
        ViewChild('myvideo'),
        __metadata("design:type", Object)
    ], AddStudentActivity.prototype, "myVideo", void 0);
    AddStudentActivity = __decorate([
        Component({
            selector: 'add-student-activity',
            templateUrl: 'addstudentactivity.html',
            // styleUrls: ['addstudentactivity.css'],
            providers: [ClassAttendanceService, AssignmentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Platform,
            ViewController,
            AlertController,
            ClassAttendanceService,
            AssignmentsService,
            FileTransfer,
            Camera,
            LoadingController,
            ToastController,
            StreamingMedia,
            FileChooser,
            MediaCapture,
            Transfer,
            ActionSheetController,
            Storage])
    ], AddStudentActivity);
    return AddStudentActivity;
}());
export { AddStudentActivity };
//# sourceMappingURL=addstudentactivity.js.map