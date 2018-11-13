import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ClassAttendanceService} from '../../services/classattendance.service'
import {StudentsService} from '../../services/students.service'
import {HomePage} from '../../pages/home/home';

@Component({
  selector: 'class-attendance',
  templateUrl: 'classattendance.html',
  providers: [ClassAttendanceService, StudentsService]
})
export class ClassAttendance {

  allStudents: any = []
  loggedUser: any = null
  classId: any = null
  todayAttendance: any = null
  attendeStudents: any = []

  disableBtn: boolean = false


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public Events: Events,
    public _classAttendanceService: ClassAttendanceService,
    public _studentsService: StudentsService,
    private storage: Storage) {
      if (navParams.data.students || navParams.data.classId){
        this.allStudents = this.navParams.data.students
        this.classId = this.navParams.data.classId.id
      }else{
        this.classId = this.navParams.get('classObject').id
      }
  }

  ionViewWillEnter() {
    let created_at = this.getDate()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.allStudents = this.navParams.get('students')
      // this.classId = this.navParams.get('classId')
      console.log("LOCAL STORAGE FROM CLASS ATTENDANCE:---\n", this.loggedUser,
                  // "\nSTUDENTS FROM CLASS ATTENDANCE PARAMS:---\n", this.allStudents,
                  "\nCLASS ID:---\n", this.classId)
      this.Events.publish('class:selected', this.navParams.get('classObject').name);
      this.getAttendanceByDate(created_at)
    })
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

  getAttendanceByDate(created_at){
    console.log("CLASS ATTENDANCE OPTIONS:--\n", created_at, this.classId)
    this._classAttendanceService.getTodayClassAttendance(created_at, this.classId)
    .subscribe(result => {
      console.log('RESULT FROM CLASS ATTENDANCE:--\n', result)
      if (!result.status){
        this._studentsService.allStudentsByClassId(this.classId)
        .subscribe(result => {
          console.log('RESULT FROM CLASS STUDENTS IN ATTENDANCE:--\n', result.students)
          this.allStudents = result.students
          if (this.allStudents){
            for (let student of this.allStudents){
              student.isPresent = false
              student.disabled = false
            }
          }
          this.disableBtn = false
        })
      }else{
        var attendances = result.attendance
        for (let student of result.attendance){
          student.student.isPresent = student.isPresent
          this.attendeStudents.push(student.student)
        }
        console.log('RESULT AFTER ATTENDANCE FOUND:--\n', this.attendeStudents)
        this.disableBtn = true
        this.navCtrl.setRoot(HomePage, 
          {'attendeStudents': this.attendeStudents, 
           'classObject': this.navParams.get('classObject')
          })
      }
    })
  }

  submitAttendance(){
    let attendanceStudents = []
    let created_at = this.getDate();
    for (let student of this.allStudents){
      var object = {
        'id': student.id,
        'isPresent': student.isPresent
      }
      attendanceStudents.push(object)
    }
    var attendance = {
      'classId': this.classId,
      'students': attendanceStudents,
      'date': created_at
    }
    console.log("ATTENDANCE OBJECT TO PUSH:--\n", attendance,)
    this._classAttendanceService.addAttendance(attendance)
    .subscribe(result => {
      console.log("RESILT FROM ADDING ATTENDANCE:---\n", result)
      if (result.status){
        this.getAttendanceByDate(this.getDate())
        this.disableBtn = true
      }
    })
  }

}
