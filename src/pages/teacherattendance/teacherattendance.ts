import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ClassAttendanceService} from '../../services/classattendance.service'

@Component({
  selector: 'teacher-attendance',
  templateUrl: 'teacherattendance.html',
  providers: [ClassAttendanceService]
})
export class TeacherAttendance {

  allStudents: any = []
  loggedUser: any = null
  teacherSelected: any = null
  todayAttendance: any = null
  eventSource: any = []

  todayDate: any = null
  isPresent: boolean = false
  isDisable: boolean = false
  disableBtn: boolean = false
  allAttendances: any = []

  // CALENDAR
  selectedDay = new Date()
  selectedDate: any;
  selectedObject
  viewTitle;
  isToday: boolean;
  calendarModes = [
    { key: 'month', value: 'Month' },
    { key: 'week', value: 'Week' },
    { key: 'day', value: 'Day' },
  ]
  calendar = {
    mode: this.calendarModes[0].key,
    currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _classAttendanceService: ClassAttendanceService,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    this.todayDate = this.getDate()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      this.teacherSelected = _.cloneDeep(this.loggedUser);
      // this.allAttendances = _.sortBy(this.navParams.get('attendances'), ['dateCreated']);
      console.log("LOCAL STORAGE FROM TEACHER ATTENDANCE:---\n", this.loggedUser, this.teacherSelected, this.allAttendances)
      this._classAttendanceService.getTodayTeacherAttendance(this.getDate(), this.loggedUser.teacher.id)
      .subscribe(result => {
        console.log('RESULT FROM TEACHER TODAY ATTENDANCE:--\n', result)
        if (result.status){
          this.disableBtn = true
          this.isDisable = true
          this.isPresent = result.attendance.isPresent
        }else{
          this.isDisable = false
          this.disableBtn = false
        }
        this.getTeacherMonthAttendance(this.loggedUser.teacher.id, this.getMonth(), this.getYear())
      })
    })
  }
  
  // checkDate(checkdate){
  //   var checkDate = moment(checkdate)
  //   var checkDay = checkDate.format('D');
  //   var checkFlag = false 
  //   var return_date = null

  //   console.log("days in month:--", date)
  //   return return_date;
  // }


  getEventClass(events) {
    return 'test' + events.length;
    for (let obj of this.allAttendances){
      var date = moment(obj.dateCreated)
      var day = date.format('M')
    }
  }
  getEventId(days) {
    console.log("DAYS AND EVENTS:--", days)
  }

  
  getTeacherMonthAttendance(teacherId, month, year){
    var events = []
    var event = {}
    var i = 1;
    this._classAttendanceService.getTeacherMonthAttendance(teacherId, month, year)
    .subscribe(result => {
      if (result.status){
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
      console.log("OPTION TO FECTCH FROM TEACHER MONTH:--", teacherId, month, year)
      console.log('\nRESULT FROM TEACHER MONTH ATTENDANCE:--\n', result, '\n', this.allAttendances)
    })
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

  getMonth(){
    let month = moment().format('M')
    return month;
  }
  
  getYear(){
    let year = moment().format('YYYY')
    return year;
  }

  submitAttendance(){
    var attendance = {
      'teacherId': this.loggedUser.teacher.id,
      'isPresent': this.isPresent,
      'date': this.getDate()
    }
    console.log("ATTENDANCE OBJECT TO PUSH:--\n", attendance,)
    this._classAttendanceService.addTeacherAttendance(attendance)
    .subscribe(result => {
      console.log('RESULT FROM ADDING TEACHER ATTENDANCE:--\n', result)
      this.disableBtn = true
    })
  }

  // CALENDAR
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }
  changeMode(mode) {
    this.calendar.mode = mode;
  }
  today() {
    this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
    (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled, ev);
    this.selectedObject = ev
    // this.openActionSheet(ev)
    // this.eventSelected(ev.events[0])
  }
  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();

    this.selectedDay = event

  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (date < current);
  };

}
