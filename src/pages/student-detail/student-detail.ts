import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {StudentPerformance} from "../studentperformance/studentperformance";
import {ClassAttendanceService} from '../../services/classattendance.service';
import {StudentActivity} from "../studentactivity/studentactivity";
import {StudentAssignments} from "../studentassignment/studentassignment";
import {AssignmentsService} from '../../services/assignment.service';

@Component({
  selector: 'single-student',
  templateUrl: 'student-detail.html',
  providers: [ClassAttendanceService, AssignmentsService]
})
export class SingleStudent {

  selectedStudent: any;
  selectedClass: any;
  // allStudents: any = []
  loggedUser: any = null
  presentCount: any = null
  absentCount: any = null
  activitiesCount: any = 0
  tabBarElement: any;
  pet: any;
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  tab5: any;
  
  rootParams = {
    student: '',
    classId: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public Events: Events,
    public _classAttendanceService: ClassAttendanceService,
    public _assignmentsService: AssignmentsService,
    private storage: Storage) {
    this.selectedStudent = navParams.get('student')
    this.selectedClass = navParams.get('classId')
    this.rootParams.student = this.selectedStudent
    this.rootParams.classId = this.selectedClass
    this.tab1 = StudentPerformance
    this.tab2 = StudentActivity
    this.tab3 = StudentAssignments
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewWillEnter() {
    let presentCount = 0
    let absentCount = 0
    // this.tabBarElement.style.display = 'none';
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      console.log("LOCAL STORAGE FROM SINGLE STUDENTS:---\n", this.loggedUser,
                  "\nSTUDENT FROM PARAMS:---\n", this.selectedStudent)
      // this.Events.publish('student:clicked', true);
      this._classAttendanceService.getStudentMonthAttendance(this.selectedStudent.id, this.getMonth(), this.getYear())
      .subscribe(result => {
        console.log("RESULT FROM STUDNDENT MONTH ATTENDANCE:---\n", result)
        if (result.attendances){
          for (let obj of result.attendances){
            if (obj.isPresent)
              presentCount++
            else
              absentCount++
          }
        }  
        this.presentCount = presentCount
        this.absentCount = absentCount
        this._assignmentsService.allActivitiesByStudentId(this.selectedStudent.id)
        .subscribe(result => {
          if (result.status){
            if (result.activities)
              this.activitiesCount = result.activities.length
          }
        })
      })
    })
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

  goToPerformance(){
    this.navCtrl.push(StudentPerformance, {'student': this.selectedStudent})
  }

  goToActivity(){
    this.navCtrl.push(StudentActivity, {'student': this.selectedStudent})
  }


  ionViewWillLeave() {
    // this.tabBarElement.style.display = 'flex';
  }
  // public getClass(classobject) {
  //   // console.log("VALLUE FROM SLECTING CALSS:---\n", classobject);
  //   this.navCtrl.setRoot(HomePage, {'classObject': JSON.stringify(classobject)})
  // }

}
