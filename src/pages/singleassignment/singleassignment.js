var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { AssignmentsService } from '../../services/assignment.service';
import { StudentsService } from '../../services/students.service';
var SingleAssignment = /** @class */ (function () {
    function SingleAssignment(navCtrl, navParams, _assignmentsService, _studentsService, loadingCtrl, toastCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._assignmentsService = _assignmentsService;
        this._studentsService = _studentsService;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.storage = storage;
        this.allStudents = [];
        this.loggedUser = null;
        this.presentCount = null;
        this.absentCount = null;
        this.classId = null;
        this.markedFlag = false;
        this.unmarkedFlag = false;
    }
    SingleAssignment.prototype.ionViewWillEnter = function () {
        var _this = this;
        var presentCount = 0;
        var absentCount = 0;
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            var assignment = _this.navParams.get('assignment');
            // this.selectedAssignment = this.navParams.get('assignment')
            _this.classId = _this.navParams.get('classId');
            _this._assignmentsService.getAssignmentById(assignment.id)
                .subscribe(function (result) {
                console.log("RESULT FROM SINGLE ASSIGNMENT:---\n", result.assignment);
                _this.selectedAssignment = result.assignment;
                if (!_this.selectedAssignment.assignmentMarks.length) {
                    _this.markedFlag = false;
                    _this._studentsService.allStudentsByClassId(_this.classId)
                        .subscribe(function (result) {
                        _this.allStudents = result.students;
                        console.log("LOCAL STORAGE FROM SINGLE ASSIGNMENT:---\n", _this.loggedUser, "\nAssignment FROM PARAMS:---\n", _this.selectedAssignment, "\nALLS STUDENTS:---\n", _this.allStudents);
                        // for (let student of this.allStudents){
                        //   student.marks = 0
                        // }
                    });
                }
                else {
                    _this.markedFlag = true;
                    _this.allStudents = _this.selectedAssignment.assignmentMarks;
                }
            });
        });
    };
    SingleAssignment.prototype.rangeChanged = function ($event) {
        console.log("$EVENT CHANGED:---", $event);
    };
    SingleAssignment.prototype.getMonth = function () {
        var month = moment().format('M');
        return month;
    };
    SingleAssignment.prototype.getYear = function () {
        var year = moment().format('YYYY');
        return year;
    };
    SingleAssignment.prototype.getDate = function () {
        var day = new Date().getDate();
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var fullDate = null;
        if (month + 1 < 10) {
            fullDate = year + '-0' + (month + 1) + '-' + day;
        }
        else {
            fullDate = year + '-' + (month + 1) + '-' + day;
        }
        var created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
        created_at = created_at.replace('Z', '');
        return created_at;
    };
    SingleAssignment.prototype.submitMarks = function () {
        var _this = this;
        var students = [];
        if (!this.markedFlag) {
            for (var _i = 0, _a = this.allStudents; _i < _a.length; _i++) {
                var obj = _a[_i];
                var object = {
                    'id': obj.id,
                    'marks': obj.marks,
                };
                students.push(object);
            }
        }
        else {
            for (var _b = 0, _c = this.allStudents; _b < _c.length; _b++) {
                var obj = _c[_b];
                var object = {
                    'id': obj.studentId,
                    'marks': obj.marks,
                };
                students.push(object);
            }
        }
        var assignment = {
            'assignmentId': this.selectedAssignment.id,
            'students': students
        };
        console.log("this.allStudents:==\n", assignment);
        this.presentLoading();
        this._assignmentsService.markAssignment(assignment)
            .subscribe(function (result) {
            console.log("RESULT AFTER ASSSING THE ASSIGNMENT MARKS:--", result);
            _this.loader.dismissAll();
            _this.presentToast('Assignment Marked Successfully!');
        });
    };
    SingleAssignment.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SingleAssignment.prototype.presentLoading = function () {
        this.loader = this.loadingCtrl.create({
            content: 'Uploading…'
        });
        this.loader.present();
    };
    SingleAssignment = __decorate([
        Component({
            selector: 'single-assignment',
            templateUrl: 'singleassignment.html',
            providers: [AssignmentsService, StudentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            AssignmentsService,
            StudentsService,
            LoadingController,
            ToastController,
            Storage])
    ], SingleAssignment);
    return SingleAssignment;
}());
export { SingleAssignment };
//# sourceMappingURL=singleassignment.js.map