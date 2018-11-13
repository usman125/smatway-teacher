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
// import { Component } from '@angular/';
// import { ContentResolver } from '@angular/common';
// import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ClassAttendanceService } from '../../services/classattendance.service';
import { AssignmentsService } from '../../services/assignment.service';
import { NavController, LoadingController, ToastController, Platform, NavParams, ViewController, ActionSheetController, AlertController } from 'ionic-angular';
// import { NavController, 
//          ModalController, 
//          LoadingController,
//          ToastController, 
//          Platform, 
//          NavParams, 
//          ViewController,
//          AlertController } from 'ionic-context';
import { FileTransfer, } from '@ionic-native/file-transfer';
import { Camera, } from '@ionic-native/camera';
import { Transfer, } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture } from '@ionic-native/media-capture';
import { StreamingMedia } from '@ionic-native/streaming-media';
// import { Conre } from '@ionic-native/file';
var AddAssignment = /** @class */ (function () {
    function AddAssignment(navCtrl, navParams, platform, viewCtrl, alertController, _classAttendanceService, _assignmentsService, transfer, camera, loadingCtrl, toastCtrl, streamingMedia, fileChooser, mediaCapture, _transfer, actionSheetCtrl, storage) {
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
        this.classId = null;
        this.disableBtn = false;
        this.assignmentTitle = null;
        this.assignmentDate = null;
        this.imageURI = null;
        // presentToast: ToastController;
        this.imageFileName = null;
        this.imageFileName1 = null;
        this.imageFileName2 = null;
        this.uriType = null;
        this.flag_upload = true;
        this.flag_play = true;
    }
    AddAssignment.prototype.ionViewWillEnter = function () {
        var _this = this;
        var created_at = this.getDate();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            // this.allStudents = this.navParams.get('students')
            _this.classId = _this.navParams.get('classId');
            console.log("LOCAL STORAGE FROM ADD ASSIGNMENT:---\n", _this.loggedUser, "\nCLASS ID:---\n", _this.classId);
        });
    };
    AddAssignment.prototype.showAlert = function () {
        var alert = this.alertController.create({
            title: 'Done!',
            subTitle: 'Assigmment Added Successfully!',
            buttons: ['OK']
        });
        alert.present();
    };
    AddAssignment.prototype.getGalleryImage = function () {
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
    AddAssignment.prototype.getCameraImage = function () {
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
    AddAssignment.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    AddAssignment.prototype.uploadFile = function () {
        var _this = this;
        var loader = this.loadingCtrl.create({
            content: "Uploading..."
        });
        loader.present();
        var fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'file',
            fileName: 'ionicfile',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: { 'type': 'image', 'studentId': '4', 'Extension': '.jpg' }
        };
        fileTransfer.upload(this.imageURI, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options)
            .then(function (data) {
            var image = JSON.parse(data.response);
            _this.imageFileName = image.url;
            console.log(data.response + " Uploaded Successfully" + _this.imageFileName);
            loader.dismiss();
            _this.presentToast("Image uploaded successfully");
        }, function (err) {
            console.log(err);
            loader.dismiss();
            _this.presentToast(err);
            alert(err);
        });
    };
    AddAssignment.prototype.presentActionSheet = function () {
        var _this = this;
        var actionSheet = this.actionSheetCtrl.create({
            title: '‘Select Image Source',
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
    AddAssignment.prototype.presentImageUploadSheet = function () {
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
    AddAssignment.prototype.getVideo = function () {
        var _this = this;
        this.fileChooser.open()
            .then(function (uri) {
            _this.videoId = uri;
            _this.flag_play = false;
            _this.flag_upload = false;
        })
            .catch(function (e) { return console.log(e); });
    };
    AddAssignment.prototype.capturevideo = function () {
        var _this = this;
        var options = { limit: 1 };
        this.mediaCapture.captureVideo(options)
            .then(function (videodata) {
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
    AddAssignment.prototype.uploadVideo = function () {
        var _this = this;
        var fileTransfer = this.transfer.create();
        var options1 = {
            fileKey: 'video_upload_file',
            fileName: this.videoId,
            headers: {},
            mimeType: 'multipart/form-data',
            params: { 'type': 'video', 'studentId': '4', 'Extension': '.mp4' },
            chunkedMode: false
        };
        this.presentLoading();
        fileTransfer.upload(this.videoId, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options1)
            .then(function (data) {
            _this.loader.dismissAll();
            _this.flag_upload = true;
            _this.showToast('middle', 'Video is uploaded Successfully!');
        }, function (err) {
            // error
            alert('error' + JSON.stringify(err));
        });
    };
    AddAssignment.prototype.showToast = function (position, message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: position
        });
        toast.present(toast);
    };
    AddAssignment.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: 'Uploading…'
        });
        this.loader.present();
    };
    AddAssignment.prototype.showErrorAlert = function () {
        var alert = this.alertController.create({
            title: 'Error!',
            subTitle: 'Title Or Date Empty!!',
            buttons: ['OK']
        });
        alert.present();
    };
    AddAssignment.prototype.getDate = function () {
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
    AddAssignment.prototype.submitAssignment = function () {
        var _this = this;
        if (this.assignmentTitle && this.assignmentDate) {
            var assigment = {
                "teacherId": this.loggedUser.teacher.id,
                "classId": this.classId,
                "title": this.assignmentTitle,
                "submissionDate": this.assignmentDate + "T00:00:00Z"
            };
            console.log("ASSIGNMENT TO SUBMIT:---\n", assigment, "\nASSIGNMENT DATE:---\n", moment(this.assignmentDate, 'YYYY-MM-DD').utcOffset(0, true).format());
            this._assignmentsService.addAssignment(assigment)
                .subscribe(function (result) {
                console.log("RESULT FROM ADDING ASSIGMENT:---", result);
                _this.showAlert();
                _this.assignmentDate = null;
                _this.assignmentTitle = null;
            });
        }
        else {
            this.showErrorAlert();
        }
    };
    AddAssignment = __decorate([
        Component({
            selector: 'add-assignment',
            templateUrl: 'addassignments.html',
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
    ], AddAssignment);
    return AddAssignment;
}());
export { AddAssignment };
//# sourceMappingURL=addassignments.js.map