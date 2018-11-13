import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         ModalController,
         LoadingController,
         ToastController, 
         ViewController,
         App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {AssignmentsService} from '../../services/assignment.service';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import {Students} from "../students/students";

@Component({
  selector: 'student-performance',
  templateUrl: 'studentperformance.html',
  providers: [AssignmentsService]
})
export class StudentPerformance {

  selectedStudent: any;
  selectedClass: any;
  tabBarElement: any;
  loggedUser: any = null
  loader: any = null
  existFlag: boolean = false

  performanceForm: FormGroup;

  app: App;

  response: any = 0
  reading: any = 0
  writing: any = 0
  listening: any = 0
  speaking: any = 0

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _formBuilder: FormBuilder,
    public modalCtrl: ModalController, 
    public _assignmentsService: AssignmentsService, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage) {
    this._buildPerformanceForm()
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  _buildPerformanceForm(){
    this.performanceForm = this._formBuilder.group({
      response : new FormControl(0, Validators.required),
      writing : new FormControl(0, Validators.required),
      listening : new FormControl(0, Validators.required),
      speaking : new FormControl(0, Validators.required),
      reading : new FormControl(0, Validators.required)
    })
  }

  ionViewWillEnter() {
    this.presentLoading()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.selectedStudent = this.navParams.get('student')
      this.selectedStudent = this.navParams.data.student
      this.selectedClass = this.navParams.data.classId
      console.log("LOCAL STORAGE FROM SINGLE STUDENTS:---\n", this.loggedUser,
                  "\nSTUDENT FROM PARAMS:---\n", this.selectedStudent)
      this._assignmentsService.getOverallPerformance(this.selectedStudent.id)
      .subscribe(result => {
        console.log("OVERALL PERFORMANCE FROM GET:---", result)
        if (result.status){
          (<FormGroup>this.performanceForm).setValue({'response':result.student.response,
                                                      'writing':result.student.writing,
                                                      'listening':result.student.listening,
                                                      'speaking':result.student.speaking,
                                                      'reading':result.student.reading,}, {onlySelf: true})
        }
        this.loader.dismissAll()  
      })
    })
  }

  presentProfileModal() {
    let profileModal = this.modalCtrl.create(Profile, { 'student': this.selectedStudent });
    profileModal.present();
  }

  submitPeformance(values){
    console.log("VALUES FROM PERFORMANCE:--\n", values)
    var performance = {
      'studentId': this.selectedStudent.id,
      'response': values.response,
      'writing': values.writing,
      'listening': values.listening,
      'speaking': values.speaking,
      'reading': values.reading,
    }
    this.presentLoading()
    this._assignmentsService.markOverallPerformance(performance)
    .subscribe(result => {
      console.log("RESULT FROM ADDING OVERALL PERFORMANCE:---", result)  
      this.presentToast(result.message)
      this.loader.dismissAll()
    })
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
      content: 'loading…'
    });
    this.loader.present();
  }

  takeMeBack() {
    // this.tabBarElement.style.display = 'none';
    // this.navCtrl.setRoot(Students, {'classId': this.selectedClass});
    // this.navCtrl.popAll().then(result => {
    // })
    // this.navCtrl.pop().then(result => {
      this.navCtrl.push(Students, {'classId': this.selectedClass})
    // });
    // console.log("NAV CONTROLLER:--\n", this.app.getRootNavs())
    
  }

}

@Component({
  selector: 'student-performance',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-buttons start class="m-t-10">
        <button (click)="dismiss()" style="margin-right:10px;">
          <ion-icon name='close'></ion-icon>
        </button>
      </ion-buttons>
      <ion-title class="m-t-10">
        Student Profile
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-card>
      <ion-row>
        <ion-col col-12>
          <img src="{{selectedStudent?.imageUrl}}">
        </ion-col>
        <ion-col col=12 class="info-box">
          <div class="header-title-alt text-secondary">student information</div>
          <div class="box">
            <span id="name">Name </span>
            <span id="name-value"> {{selectedStudent?.name}}</span>
          </div>
          <div class="box">
            <span id="name">School Name </span>
            <span id="name-value"> {{selectedStudent?.schoolName}}</span>
          </div>

          <div class="box">
            <span id="name">School Reg. Number</span>
            <span id="name-value"> {{selectedStudent?.schoolIdentityNo}}</span>
          </div>
          <div class="box">
            <span id="name">Address </span>
            <span id="name-value"> {{selectedStudent?.address}}</span>
          </div>
          <div class="box">
            <span id="name">Nationality </span>
            <span id="name-value"> {{selectedStudent?.nationality}}</span>
          </div>

          <div class="box">
            <span id="name">Registration Date </span>
            <span id="name-value"> {{selectedStudent?.registrationDate | date:'fullDate'}}</span>
          </div>

          <div class="box">
            <span id="name">Passport #</span>
            <span id="name-value"> {{selectedStudent?.passportNo}}</span>
          </div>
        </ion-col>
      </ion-row>
    </ion-card>

    <ion-card>
      <ion-row>
        <ion-col col=12 class="info-box">
          <div class="header-title-alt text-secondary">parent information</div>
          <div class="box">
            <span id="name">Name </span>
            <span id="name-value"> {{selectedStudent?.studentParent.name}}</span>
          </div>
          <div class="box">
            <span id="name">Relation With Student </span>
            <span id="name-value"> {{selectedStudent?.studentParent.relationWithStudent}}</span>
          </div>
          <div class="box">
            <span id="name">Address </span>
            <span id="name-value"> {{selectedStudent?.studentParent.address}}</span>
          </div>
          <div class="box">
            <span id="name">Nationality </span>
            <span id="name-value"> {{selectedStudent?.studentParent.nationality}}</span>
          </div>

          <div class="box">
            <span id="name">Passport #</span>
            <span id="name-value"> {{selectedStudent?.studentParent.passportNo}}</span>
          </div>
        </ion-col>
      </ion-row>
    </ion-card>
  </ion-content>`
})

export class Profile {

  selectedStudent: any = null

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {
    // console.log('UserId', navParams.get('userId'));
    this.selectedStudent = navParams.get('student')
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }
}