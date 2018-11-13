import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ClassAttendanceService} from '../../services/classattendance.service'
import {AssignmentsService} from '../../services/assignment.service'
import { NavController, 
         ModalController, 
         LoadingController,
         ToastController, 
         Platform, 
         NavParams, 
         ViewController,
         ActionSheetController,
         AlertController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject, } from '@ionic-native/file-transfer';
import { Camera, CameraOptions, } from '@ionic-native/camera';
import { Transfer, TransferObject, } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'add-student-activity',
  templateUrl: 'addstudentactivity.html',
  // styleUrls: ['addstudentactivity.css'],
  providers: [ClassAttendanceService, AssignmentsService]
})

export class AddStudentActivity {

  loggedUser: any = null
  student: any = null


  imageURI:any = null;
  imageFileName:any = null;
  imageFileName1:any = null;
  imageFileName2:any = null;
  uriType:any = null;

  previewImage:any = null;
  previewVideo:any = null;
  imageCaption:any = null;
  videoCaption:any = null;
  loader: any;
  videoId: any;
  flag_upload = true;
  flag_play = true;

  @ViewChild('myvideo') myVideo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private domSanitizer: DomSanitizer,
    public platform: Platform,
    public viewCtrl: ViewController,
    public alertController: AlertController,
    public _classAttendanceService: ClassAttendanceService,
    public _assignmentsService: AssignmentsService,
    private transfer: FileTransfer,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public streamingMedia: StreamingMedia, 
    public fileChooser: FileChooser, 
    private mediaCapture: MediaCapture,
    private _transfer: Transfer, 
    public actionSheetCtrl: ActionSheetController,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    let created_at = this.getDate()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      this.student = this.navParams.get('student')
      console.log("LOCAL STORAGE FROM ADD ASSIGNMENT:---\n", this.loggedUser,
                  "\nSDTUENT:---\n", this.student)
    })
  }



  getGalleryImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.previewImage = imageData; 
      console.log("IMAGE URI:--\n", this.imageURI);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  getCameraImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.previewImage = imageData; 
      // this.previewImage = 'data:image/jpeg;base64,' + imageData; 
      console.log("IMAGE URI:--\n", this.imageURI);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }





  uploadFile() {
    // let loader = this.loadingCtrl.create({
    //   content: "Uploading..."
    // });
    // loader.present();
    this.presentLoading();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: {'type': 'image', 'studentId': this.student.id, 'Extension': '.jpg', 'caption': this.imageCaption}
    }

    fileTransfer.upload(this.imageURI, 'https://mmschoolapp.azurewebsites.net/api/activities/create/student', options)
      .then((data) => {
      var image = JSON.parse(data.response)
      this.imageFileName = image.activity.url
      this.loader.dismissAll();
      this.presentToast("Image uploaded successfully");
      console.log(data.response+" Uploaded Successfully"+this.imageFileName);
      this.imageURI = null
      this.imageCaption = null
      this.previewImage = null
    }, (err) => {
      console.log(err);
      this.loader.dismissAll();
      this.presentToast(err);
      alert(err)
    });
  }


  public presentImageUploadSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '‘Select Image Source',
      buttons: [{
        text: '‘Load from Gallery’',
        handler: () => {
          this.getGalleryImage();
        }
      },
      {
        text: '‘Use Camera’',
        handler: () => {
          this.getCameraImage();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }


  public presentVideoUploadSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '‘Select Video Source',
      buttons: [{
        text: '‘Load from Gallery’',
        handler: () => {
          this.getVideo();
        }
      },
      {
        text: '‘Use Camera’',
        handler: () => {
          this.capturevideo();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    actionSheet.present();
  }

  getVideo() {
    this.fileChooser.open()
    .then(uri => {
      this.videoId = uri;
      this.flag_play = false;
      this.flag_upload = false;
    })
    .catch(e => console.log(e));
  }

  capturevideo() {
    let options: CaptureVideoOptions = { limit: 1 };
    this.mediaCapture.captureVideo(options).then((videodata: MediaFile[]) => {
      var i, path, len;
      for (i = 0, len = videodata.length; i < len; i += 1) {
        path = videodata[i].fullPath;
        // do something interesting with the file
      }
      this.videoId = path;
      this.flag_play = false;
      this.flag_upload = false;
    });
  }

  uploadVideo() {
    let fileTransfer: FileTransferObject = this.transfer.create();
    // let video = this.myVideo.nativeElement;

    let options1: FileUploadOptions = {
      fileKey: 'video',
      fileName: this.videoId,
      headers: {},
      mimeType: 'multipart/form-data',
      params: {'type': 'video', 'studentId': this.student.id, 'Extension': '.mp4', 'caption': this.videoCaption },
      chunkedMode: true
    }

    this.presentLoading();
    fileTransfer.upload(this.videoId, 'https://mmschoolapp.azurewebsites.net/api/activities/create/student', options1)
    .then((data) => {
      console.log('SUCCESSFULLY ADDED VIDEO****' + JSON.stringify(data.response));
      this.loader.dismissAll();
      var result = JSON.parse(data.response)
      // video.src = result.activity.url;
      this.videoId = null
      this.flag_upload = true;
      this.presentToast('Video is uploaded Successfully!');
      this.videoCaption = null
    }, (err) => {
      alert('error' + JSON.stringify(err));
    });
  }


  playVideo() {
    let options: StreamingVideoOptions = {
    successCallback: () => { this.flag_upload = true; console.log('Video played'); },
    errorCallback: (e) => { console.log('Error streaming'); this.presentToast("No Video Selected..") },
      orientation: 'landscape'
    };
    this.streamingMedia.playVideo(this.videoId, options);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Uploading…'
    });
    this.loader.present();
  }

  getDate(){
    let day = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    let fullDate = null
    let attendanceStudents = []
    if (month+1 < 10){
      fullDate = year+'-0'+(month+1)+'-'+day
    }else{
      fullDate = year+'-'+(month+1)+'-'+day
    }
    let created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
    return created_at;
  }

}
