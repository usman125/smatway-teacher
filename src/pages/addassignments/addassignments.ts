import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as _ from 'lodash';
import {StudentsService} from '../../services/students.service'
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

@Component({
  selector: 'add-assignment',
  templateUrl: 'addassignments.html',
  providers: [StudentsService, AssignmentsService]
})

export class AddAssignment {

  loggedUser: any = null
  classId: any = null

  disableBtn: boolean = false
  assignmentTitle: any = null
  assignmentDate: any = null
  selectedStudent: any = null

  imageURI:any = null;
  imageFileName:any = null;
  imageFileName1:any = null;
  imageFileName2:any = null;
  uriType:any = null;

  loader: any;
  videoId: any;
  flag_upload = true;
  flag_play = true;

  allStudents: any = []


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public viewCtrl: ViewController,
    public alertController: AlertController,
    public _studentsService: StudentsService,
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
      this.classId = this.navParams.get('classId')
      this._studentsService.allStudentsByClassId(this.classId)
      .subscribe(result => {
        this.allStudents = result.students
        console.log("LOCAL STORAGE FROM ADD ASSIGNMENT:---\n", this.loggedUser,
                    "\nALL STUDENTS FROM ADD ASSIGNMENT:---\n", this.allStudents,
                    "\nCLASS ID:---\n", this.classId)
      })

    })
  }

  showAlert() {
    const alert = this.alertController.create({
      title: 'Done!',
      subTitle: 'Assigmment Added Successfully!',
      buttons: ['OK']
    });
    alert.present();
  }

  getGalleryImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
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
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      console.log("IMAGE URI:--\n", this.imageURI);
    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }



  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  sendAssignTo(item){
    console.log('SEND ASSGNMENT OT:_--', item);
  }

  uploadFile() {
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {},
      params: {'type': 'image', 'studentId':'4', 'Extension': '.jpg'}
    }

    fileTransfer.upload(this.imageURI, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options)
      .then((data) => {
      var image = JSON.parse(data.response)
      this.imageFileName = image.url
      console.log(data.response+" Uploaded Successfully"+this.imageFileName);
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      loader.dismiss();
      this.presentToast(err);
      alert(err)
    });
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '‘Select Image Source',
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
    this.mediaCapture.captureVideo(options)
    .then((videodata: MediaFile[]) => {
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
    let options1: FileUploadOptions = {
      fileKey: 'video_upload_file',
      fileName: this.videoId,
      headers: {},
      mimeType: 'multipart/form-data',
      params: {'type': 'video', 'studentId':'4', 'Extension': '.mp4' },
      chunkedMode: false
    }

    this.presentLoading();
    fileTransfer.upload(this.videoId, 'https://mmschoolapp.azurewebsites.net/api/activities/create', options1)
    .then((data) => {
      this.loader.dismissAll();
      this.flag_upload = true;
      this.showToast('middle', 'Video is uploaded Successfully!');
    }, (err) => {
      // error
      alert('error' + JSON.stringify(err));
    });
  }

  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
    message: message,
    duration: 3000,
    position: position
    });
    toast.present(toast);
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Uploading…'
    });
    this.loader.present();
  }

  showErrorAlert() {
    const alert = this.alertController.create({
      title: 'Error!',
      subTitle: 'Please Fill Form Fields!!',
      buttons: ['OK']
    });
    alert.present();
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

  submitAssignment(){
    var assigment: any = {}
    if (this.assignmentTitle && this.assignmentDate && this.selectedStudent){
      if (this.selectedStudent == 'all'){
        assigment = {
          "teacherId" : this.loggedUser.teacher.id,
          "classId": this.classId,
          "title": this.assignmentTitle,
          "submissionDate": this.assignmentDate+"T00:00:00Z"
        }
        console.log("ASSIGNMENT TO SUBMIT:---\n", assigment,
                    "\nASSIGNMENT DATE:---\n", moment(this.assignmentDate, 'YYYY-MM-DD').utcOffset(0, true).format())
        this._assignmentsService.addAssignment(assigment)
        .subscribe(result => {
          console.log("RESULT FROM ADDING ASSIGMENT:---", result)
          this.resetForm()
        })
      }else{
        assigment = {
          "teacherId" : this.loggedUser.teacher.id,
          "studentId": this.selectedStudent,
          "title": this.assignmentTitle,
          "submissionDate": this.assignmentDate+"T00:00:00Z"
        }
        console.log("ASSIGNMENT TO SUBMIT:---\n", assigment,
                    "\nASSIGNMENT DATE:---\n", moment(this.assignmentDate, 'YYYY-MM-DD').utcOffset(0, true).format())
        this._assignmentsService.addStudentAssignment(assigment)
        .subscribe(result => {
          console.log("RESULT FROM ADDING STUDENT ASSIGMENT:---", result)
          this.resetForm()
        })


      }
    }else{
      this.showErrorAlert()
    }
  }

  resetForm(){
    this.showAlert()
    this.assignmentDate = null
    this.assignmentTitle = null
    this.selectedStudent = null
  }

}
