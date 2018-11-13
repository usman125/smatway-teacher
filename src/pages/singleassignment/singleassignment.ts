import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {StudentPerformance} from "../studentperformance/studentperformance";
import {AssignmentsService} from '../../services/assignment.service';
import {StudentsService} from '../../services/students.service';
import {StudentActivity} from "../studentactivity/studentactivity";


@Component({
  selector: 'single-assignment',
  templateUrl: 'singleassignment.html',
  providers: [AssignmentsService, StudentsService]
})
export class SingleAssignment {

  selectedAssignment: any;
  allStudents: any = []
  loggedUser: any = null
  presentCount: any = null
  absentCount: any = null
  classId: any = null
  markedFlag: boolean = false
  unmarkedFlag: boolean = false
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _assignmentsService: AssignmentsService,
    public _studentsService: StudentsService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    let presentCount = 0
    let absentCount = 0
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      var assignment = this.navParams.get('assignment')
      // this.selectedAssignment = this.navParams.get('assignment')
      this.classId = this.navParams.get('classId')
      this._assignmentsService.getAssignmentById(assignment.id)
      .subscribe(result => {
        console.log("RESULT FROM SINGLE ASSIGNMENT:---\n", result.assignment,)
        this.selectedAssignment = result.assignment
        if (!this.selectedAssignment.assignmentMarks.length){
          this.markedFlag = false
          this._studentsService.allStudentsByClassId(this.classId)
          .subscribe(result => {
            this.allStudents = result.students
            console.log("LOCAL STORAGE FROM SINGLE ASSIGNMENT:---\n", this.loggedUser,
                      "\nAssignment FROM PARAMS:---\n", this.selectedAssignment,
                      "\nALLS STUDENTS:---\n", this.allStudents)
            // for (let student of this.allStudents){
            //   student.marks = 0
            // }
          })
        }else{
          this.markedFlag = true
          this.allStudents = this.selectedAssignment.assignmentMarks
        }
      })
      
    })
  }

  rangeChanged($event){
    console.log("$EVENT CHANGED:---", $event)
  }

  getMonth(){
    let month = moment().format('M')
    return month;
  }
  
  getYear(){
    let year = moment().format('YYYY')
    return year;
  }


  getDate(){

    let day = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    let fullDate = null
    if (month+1 < 10){
      fullDate = year+'-0'+(month+1)+'-'+day
    }else{
      fullDate = year+'-'+(month+1)+'-'+day
    }
    let created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
    created_at = created_at.replace('Z', '')
    return created_at
  }

  submitMarks(){
    var students = []
    if (!this.markedFlag){

      for (let obj of this.allStudents){
        var object = {
          'id': obj.id,
          'marks': obj.marks,
        }
        students.push(object)
      }
    }else{
      for (let obj of this.allStudents){
        var object = {
          'id': obj.studentId,
          'marks': obj.marks,
        }
        students.push(object)
      }
    }
    var assignment = {
      'assignmentId': this.selectedAssignment.id,
      'students': students
    }
    console.log("this.allStudents:==\n", assignment)
    this.presentLoading()
    this._assignmentsService.markAssignment(assignment)
    .subscribe(result => {
      console.log("RESULT AFTER ASSSING THE ASSIGNMENT MARKS:--", result)
      this.loader.dismissAll()
      this.presentToast('Assignment Marked Successfully!')
    })
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

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Uploading…'
    });
    this.loader.present();
  }

}
