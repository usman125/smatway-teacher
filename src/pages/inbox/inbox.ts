import { Component } from '@angular/core';
import { NavController, 
         NavParams, 
         ModalController,
         LoadingController,
         ToastController, 
         ViewController,
         Events,
         App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {StudentsService} from '../../services/students.service';
import {ClassesService} from '../../services/classes.service';
import {InboxService} from '../../services/inbox.service';
import {SingleChat} from '../singlechat/singlechat';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import * as moment from 'moment'

@Component({
  selector: 'all-inbox',
  templateUrl: 'inbox.html',
  providers: [StudentsService, InboxService]
})

export class Inbox {

  selectedStudent: any;
  loggedUser: any = null
  loader: any = null
  allChats: any = []

  performanceForm: FormGroup;

  modelClosed: boolean = false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _formBuilder: FormBuilder,
    public modalCtrl: ModalController, 
    public _studentsService: StudentsService, 
    public _inboxService: InboxService, 
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events,
    private storage: Storage) {
    this._buildPerformanceForm()
    events.subscribe('model-closed', (val) => {
      console.log('MODEL CLOSED EVENT:--\n', val);
      if (val){
        this.getAllChats()
      }
    });
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
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.selectedStudent = this.loggedUser.student
      console.log("LOCAL STORAGE FROM CHAT:---\n", this.loggedUser,
                  // "\nSTUDENT FROM PARAMS:---\n", this.selectedStudent
                  )
      this.getAllChats()
    })
  }

  getAllChats(){
    this._inboxService.allChatsByUserId(this.loggedUser.id)
    .subscribe(result => {
      console.log("ALL CHATS OF USER:---\n", result,)
      this.allChats = result.conversations
      for (let chat of this.allChats){
        chat.date = moment(chat.messages[0].dateCreated).utc().fromNow()
        // if (this.loggedUser.id === chat.messages[0].senderId){
        //   var teacherName = this.getTeacherInfo(chat.messages[0].receiverId)
        //   console.log("USER SENDER:--\n", teacherName)
        // }
        // if (this.loggedUser.id === chat.messages[0].receiverId){
        //   var teaherName = this.getTeacherInfo(chat.messages[0].senderId)
        //   console.log("USER RECEIVER:--\n", teacherName)
        // }
      }
    })
  }

  // getTeacherInfo(teacherId){
  //   var teacher = null
  //   this._inboxService.teacherByUserId(teacherId)
  //   .subscribe(result => {
  //     console.log("USER NAME TO SHOW IN CHAT:---\n", result)
  //     teacher = result.teacher  
  //   })
  //   return teacher;
  // }

  getSenderInfo(parentId){
    var parent = null
    this._inboxService.parentByUserId(parentId)
    .subscribe(result => {
      console.log("USER NAME TO SHOW IN CHAT:---\n", result)
      parent = result.parent  
    })
    return parent;
  }

  presentSendMessageModal() {
    let profileModal = this.modalCtrl.create(SendMessage, { 'student': this.loggedUser.student, 'user': this.loggedUser });
    profileModal.present();
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

  singleChat(chat){
    this.navCtrl.push(SingleChat, {'chat': chat})
  }

}

@Component({
  selector: 'send-message',
  providers: [StudentsService, ClassesService, InboxService],
  template: `
  <ion-header>
    <ion-navbar>
      <ion-buttons start class="m-t-10">
        <button (click)="dismiss()" style="margin-right:10px;">
          <ion-icon name='close'></ion-icon>
        </button>
      </ion-buttons>
      <ion-title class="m-t-10">
        <ion-chip>
          <ion-icon name="contact"></ion-icon>
          <ion-label>{{teacher?.name}}</ion-label>
        </ion-chip> 
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label fixed>Message</ion-label>
      <ion-textarea type="text" value='' [(ngModel)]='message'></ion-textarea>
    </ion-item>
    <button ion-button block color="secondary" class="marginT-16" (click)="sendMessage()" tappable>Send</button>
  </ion-content>`
})


export class SendMessage {

  student: any = null
  teacher: any = null
  teachers: any = []
  selectedTeacher: any = null
  message: any = null
  loggedUser: any = null

  constructor(public navParams: NavParams,
              public _studentsService: StudentsService,
              public _classesService: ClassesService,
              public _inboxService: InboxService, 
              public toastCtrl: ToastController, 
              public events: Events,
              public viewCtrl: ViewController) {
    console.log('STUDENT', navParams.get('student'));
    this.student = navParams.get('student')
    this.loggedUser = navParams.get('user')

  }

  ionViewWillEnter(){
    if (this.student.classId){
      this._classesService.getClassById(this.student.classId)
      .subscribe(result => {
        this.teacher = result.classObject.teacher
        console.log('MESASGE TACHER:--\n', this.teacher);
      })
    }else{
      console.log('STUDENT HAS NO CLASS:--\n');
    }
  }

  sendMessage(){
    var chat = {
      'senderId': this.loggedUser.id,
      'receiverId': this.teacher.userId,
      'message': this.message
    }
    if (chat.message){
      this._inboxService.addNewChat(chat)
      .subscribe(result => {
        console.log("CHAT TO SAVE:--\n", chat, "\nRESULT AFTER SAVE:---\n", result)
        this.message = null
      })
    }else{
      this.presentToast("Message Body Empty!!")
    }
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

  dismiss(){
    this.teacher = null
    this.message = null
    this.events.publish('model-closed', true)
    this.viewCtrl.dismiss()
  }
}