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
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { StudentPerformance } from "../studentperformance/studentperformance";
import { ClassAttendanceService } from '../../services/classattendance.service';
import { StudentActivity } from "../studentactivity/studentactivity";
import { AssignmentsService } from '../../services/assignment.service';
var SingleStudent = /** @class */ (function () {
    function SingleStudent(navCtrl, navParams, _classAttendanceService, _assignmentsService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._classAttendanceService = _classAttendanceService;
        this._assignmentsService = _assignmentsService;
        this.storage = storage;
        // allStudents: any = []
        this.loggedUser = null;
        this.presentCount = null;
        this.absentCount = null;
        this.activitiesCount = 0;
    }
    SingleStudent.prototype.ionViewWillEnter = function () {
        var _this = this;
        var presentCount = 0;
        var absentCount = 0;
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.selectedStudent = _this.navParams.get('student');
            console.log("LOCAL STORAGE FROM SINGLE STUDENTS:---\n", _this.loggedUser, "\nSTUDENT FROM PARAMS:---\n", _this.selectedStudent);
            _this._classAttendanceService.getStudentMonthAttendance(_this.selectedStudent.id, _this.getMonth(), _this.getYear())
                .subscribe(function (result) {
                console.log("RESULT FROM STUDNDENT MONTH ATTENDANCE:---\n", result);
                if (result.attendances) {
                    for (var _i = 0, _a = result.attendances; _i < _a.length; _i++) {
                        var obj = _a[_i];
                        if (obj.isPresent)
                            presentCount++;
                        else
                            absentCount++;
                    }
                }
                _this.presentCount = presentCount;
                _this.absentCount = absentCount;
                _this._assignmentsService.allActivitiesByStudentId(_this.selectedStudent.id)
                    .subscribe(function (result) {
                    _this.activitiesCount = result.activities.length;
                });
            });
        });
    };
    SingleStudent.prototype.getMonth = function () {
        var month = moment().format('M');
        return month;
    };
    SingleStudent.prototype.getYear = function () {
        var year = moment().format('YYYY');
        return year;
    };
    SingleStudent.prototype.getDate = function () {
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
    SingleStudent.prototype.goToPerformance = function () {
        this.navCtrl.push(StudentPerformance, { 'student': this.selectedStudent });
    };
    SingleStudent.prototype.goToActivity = function () {
        this.navCtrl.push(StudentActivity, { 'student': this.selectedStudent });
    };
    SingleStudent = __decorate([
        Component({
            selector: 'single-student',
            templateUrl: 'student-detail.html',
            providers: [ClassAttendanceService, AssignmentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ClassAttendanceService,
            AssignmentsService,
            Storage])
    ], SingleStudent);
    return SingleStudent;
}());
export { SingleStudent };
//# sourceMappingURL=student-detail.js.map