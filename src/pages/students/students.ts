import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { HttpErrorResponse } from '@angular/common/http';
import {StudentsService} from '../../services/students.service';
import {SingleStudent} from '../../pages/student-detail/student-detail';
import * as _ from 'lodash';

@Component({
  selector: 'all-students',
  templateUrl: 'students.html',
  providers: [StudentsService]
})
export class Students {

  allSortedStudents: any = null;
  allStudents: any = []
  loggedUser: any = null
  selectedClass: any = null
  attendeStudents: any = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _studentsService: StudentsService,
    public Events: Events,
    private storage: Storage) {
    // console.log("\nNAV PARAMS FROM TABS:---\n", navParams.data)
    if (navParams.data.classId){
      this.selectedClass = navParams.data.classId
      this.attendeStudents = navParams.data.attendeStudents
    }else{
      this.selectedClass = navParams.get('classObject')
      this.attendeStudents = navParams.get('attendeStudents')
    }
  }

  ionViewWillEnter() {
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.allStudents = this.navParams.get('students')
      this._studentsService.allSortStudentsByClassId(this.selectedClass.id)
      .subscribe(result => {
        this.allSortedStudents = result.students
        // if (this.allStudents)
        //   this.allStudents = this.allStudents.sort((a,b) => a.name.localeCompare(b.name));
        this.Events.publish('class:selected', this.selectedClass);
        for (let obj of this.allSortedStudents){
          for (let student of obj.students){
            var key: any = _.filter(this.attendeStudents, {'id': student.id})
            student.isPresent = key[0].isPresent
          }
        }
        console.log("LOCAL STORAGE FROM STUDENTS:---\n", this.loggedUser,
                  "\nSTUDENTS FROM SORT ALPHABT:---\n", this.allSortedStudents,
                  "\nSTUDENTS FROM ATTENDANCE:---\n", this.attendeStudents,
                  "\nNAV PARAMS FROM TABS:---\n", this.navParams.data,
                  "\nSELCTED CLASS AFETR SELCT:===\n", this.selectedClass,)
      })
    })
  }

  public getStudent(student) {
    // console.log("VALLUE FROM SLECTING CALSS:---\n", classobject);
    this.navCtrl.push(SingleStudent, {'student': student, 'classId': this.selectedClass})
  }

  getNoItem(item){
    console.log("GET NO ITEM:---\n", item);
  }

}
