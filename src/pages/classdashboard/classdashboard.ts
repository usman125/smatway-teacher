import {Component} from "@angular/core";
import {NavController, PopoverController, NavParams, LoadingController, Events} from "ionic-angular";
import {Storage} from '@ionic/storage';
import * as moment from "moment";
import * as _ from "lodash";

import {NotificationsPage} from "../notifications/notifications";
import {SettingsPage} from "../settings/settings";
import {TripsPage} from "../trips/trips";
import {Students} from "../students/students";
import {ClassActivity} from "../classactivity/classactivity";
import {ClassAttendance} from "../classattendance/classattendance";
import {TeacherAttendance} from "../teacherattendance/teacherattendance";
import {StudentsService} from '../../services/students.service';
import {ClassesService} from '../../services/classes.service';
import {ClassAttendanceService} from '../../services/classattendance.service';
import {AssignmentsService} from '../../services/assignment.service';
import {Assignments} from '../assignments/assignments';
import {Planner} from '../planner/planner';

@Component({
  selector: 'class-home',
  templateUrl: 'classdashboard.html', 
  providers: [StudentsService, ClassesService, ClassAttendanceService, AssignmentsService]
})

export class ClassDashboard {
  // search condition
  public search = {
    name: "Rio de Janeiro, Brazil",
    date: new Date().toISOString()
  }

  selectedClass: any = null
  classStudents: any = null
  loggedUser: any = null
  loader: any = null
  presentCount: any = 0
  absentCount: any = 0
  presentTeacherCount: any = 0
  absentTeacherCount: any = 0
  assignmentsCount: any = 0

  allAttendances: any = []


  toggleTabs: boolean = false;

  rootParams = {
    students: '',
    classId: '',
    attendeStudents: '',
    selectedStudent: ''
  }

  attendeStudents: any = []


  constructor(private storage: Storage, 
              private navParams: NavParams, 
              private _studentsService: StudentsService, 
              private loadingController: LoadingController, 
              private _classesService: ClassesService, 
              private _assignmentsService: AssignmentsService, 
              private _classAttendanceService: ClassAttendanceService, 
              public nav: NavController, 
              public Events: Events, 
              public popoverCtrl: PopoverController) {
    // this.selectedClass = this.navParams.get('classObject')
    this.selectedClass = this.navParams.data.classId
  }

  ionViewWillEnter() {
    let created_at = this.getDate()
    this.presentLoading()
    this.storage.get('user').then((val) => {
      this.loggedUser = JSON.parse(val)
      this._studentsService.allStudentsByClassId(this.selectedClass.id)
      .subscribe(result => {
        this.classStudents = result.students
        console.log("SELCTED CLASS AFETR SELCT:===\n", this.selectedClass, this.selectedClass.id, 
                    "\nCLASS STUDENTS:--\n", this.classStudents, 
                    "\nNAV PARAMS---", this.rootParams)
        this.getClassAttendanceByDate(created_at)
        this.getTeacherMonthAttendance(this.loggedUser.teacher.id, this.getMonth(), this.getYear())
        this.getClassAssignments(this.selectedClass.id)
        this.loader.dismissAll()
      })
    }).catch((err) => {
      console.log(err)
    });
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

  getMonth(){
    let month = moment().format('M')
    return month;
  }
  
  getYear(){
    let year = moment().format('YYYY')
    return year;
  }


  getClassAttendanceByDate(created_at){
    console.log("OPTION TO FECTCH FOR CLASS TODAY:--", created_at, this.selectedClass.id)
    this._classAttendanceService.getTodayClassAttendance(created_at, this.selectedClass.id)
    .subscribe(result => {
      console.log('RESULT FROM CLASS ATTENDANCE:--\n', result)
      var presentCount = 0
      var absentCount = 0
      if (result.status){
        for (let obj of result.attendance){
          if (obj.isPresent)
            presentCount++
          else
            absentCount++
        }
      }
      this.presentCount = presentCount
      this.absentCount = absentCount
    })
  }

  getClassAssignments(classId){
    this._assignmentsService.allAssignmentsByClassId(classId)
    .subscribe(result => {
      console.log('RESULT FROM CLASS ASSIGNMENTS:--\n', result)
      var assignmentsCount = 0
      var absentCount = 0
      if (result.status){
        this.assignmentsCount = result.assignments.length
      }
    })
  }

  getTeacherMonthAttendance(teacherId, month, year){
    console.log("OPTION TO FECTCH FROM TEACHER MONTH:--", teacherId, month, year)
    this._classAttendanceService.getTeacherMonthAttendance(teacherId, month, year)
    .subscribe(result => {
      var presentCount = 0
      var absentCount = 0
      if (result.status){
        for (let obj of result.attendances){
          if (obj.isPresent)
            presentCount++
          else
            absentCount++
        }
        this.allAttendances = result.attendances
      }
      // var allAttendances = _.groupBy(result.attendances, 'dateCreated');
      // var allAttendances = _.chain(result.attendances)
      // .groupBy("dateCreated")
      // .toPairs()
      // .map(function(currentItem) {
      //     return _.zipObject(["dateCreated", "users"], currentItem);
      // })
      // .value();
      console.log('\nRESULT FROM TEACHER MONTH ATTENDANCE:--\n', result, '\n', this.allAttendances)
      this.presentTeacherCount = presentCount
      this.absentTeacherCount = absentCount

    })
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'loading…'
    });
    this.loader.present();
  }

  // go to result page
  doSearch() {
    this.nav.push(TripsPage);
  }

  // choose students
  goToStudents() {
    this.nav.push(Students, {'students': this.classStudents});
  }

  // CLass Attendance
  goToClassAttendance() {
    this.nav.push(ClassAttendance, 
      {'students': this.classStudents, 
        'pagefor': 'student', 
        'classId': this.selectedClass.id});
  }

  // teacher Attendance
  goToTeacherAttendance() {
    this.nav.push(TeacherAttendance, {'attendances': this.allAttendances});
  }

  // Assignments Attendance
  goToAssignments() {
    this.nav.push(Assignments, {'classId': this.selectedClass.id});
  }

  // Planner
  goToPlanner() {
    this.nav.push(Planner, {'classId': this.selectedClass.id});
  }






  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

}

//
