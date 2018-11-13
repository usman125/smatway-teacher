import { Component } from '@angular/core';
import { NavController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as _ from 'lodash';
// import {ClassAttendanceService} from '../../services/classattendance.service'
import {AssignmentsService} from '../../services/assignment.service'
import { AddAssignment } from '../addassignments/addassignments';
import { SingleAssignment } from '../singleassignment/singleassignment';

@Component({
  selector: 'student-assignments',
  templateUrl: 'studentassignment.html',
  providers: [AssignmentsService]
})

export class StudentAssignments {

  loggedUser: any = null
  classId: any = null
  allAssigns: any = null
  selectedStudent: any = null

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public _assignmentsService: AssignmentsService,
    private storage: Storage) {
      this.classId = navParams.data.classId.id
      this.selectedStudent = navParams.data.student
  }

  ionViewWillEnter() {
    let created_at = this.getDate()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.allStudents = this.navParams.get('students')
      // this.classId = this.navParams.get('classId')
      console.log("LOCAL STORAGE FROM ASSIGNMENTS:---\n", this.loggedUser,
                  "\nLOCAL STORAGE FROM ASSIGNMENTS:---\n", this.selectedStudent,
                  "\nCLASS ID:---\n", this.classId)
      this._assignmentsService.allAssignmentsByStudentId(this.selectedStudent.id)
      .subscribe(result => {
        console.log("RESULT FROM ALL STUENT ASSIGNMENTS:---\n", result)
        this.allAssigns = result.assignments
      })
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

  addModel(){
    this.navCtrl.push(AddAssignment, {'classId': this.classId})
  }

  getAssignment(assignment){
    console.log("ASSIGNMENT TO GET:---\n", assignment)
    this.navCtrl.push(SingleAssignment, {'classId': this.classId, 'assignment': assignment})
  }

}

