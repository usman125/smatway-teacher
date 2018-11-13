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
import * as _ from 'lodash';
import { ClassAttendanceService } from '../../services/classattendance.service';
var TeacherAttendance = /** @class */ (function () {
    function TeacherAttendance(navCtrl, navParams, _classAttendanceService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._classAttendanceService = _classAttendanceService;
        this.storage = storage;
        this.allStudents = [];
        this.loggedUser = null;
        this.teacherSelected = null;
        this.todayAttendance = null;
        this.todayDate = null;
        this.isPresent = false;
        this.isDisable = false;
        this.disableBtn = false;
        this.allAttendances = [];
    }
    TeacherAttendance.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.todayDate = this.getDate();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.teacherSelected = _.cloneDeep(_this.loggedUser);
            _this.allAttendances = _.sortBy(_this.navParams.get('attendances'), ['dateCreated']);
            console.log("LOCAL STORAGE FROM TEACHER ATTENDANCE:---\n", _this.loggedUser, _this.teacherSelected, _this.allAttendances);
            _this._classAttendanceService.getTodayTeacherAttendance(_this.getDate(), _this.loggedUser.teacher.id)
                .subscribe(function (result) {
                console.log('RESULT FROM TEACHER TODAY ATTENDANCE:--\n', result);
                if (result.status) {
                    _this.disableBtn = true;
                    _this.isDisable = true;
                    _this.isPresent = result.attendance.isPresent;
                }
                else {
                    _this.isDisable = false;
                    _this.disableBtn = false;
                }
            });
        });
    };
    TeacherAttendance.prototype.getDate = function () {
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
    TeacherAttendance.prototype.submitAttendance = function () {
        var _this = this;
        var attendance = {
            'teacherId': this.loggedUser.teacher.id,
            'isPresent': this.isPresent,
            'date': this.getDate()
        };
        console.log("ATTENDANCE OBJECT TO PUSH:--\n", attendance);
        this._classAttendanceService.addTeacherAttendance(attendance)
            .subscribe(function (result) {
            console.log('RESULT FROM ADDING TEACHER ATTENDANCE:--\n', result);
            _this.disableBtn = true;
        });
    };
    TeacherAttendance = __decorate([
        Component({
            selector: 'teacher-attendance',
            templateUrl: 'teacherattendance.html',
            providers: [ClassAttendanceService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ClassAttendanceService,
            Storage])
    ], TeacherAttendance);
    return TeacherAttendance;
}());
export { TeacherAttendance };
//# sourceMappingURL=teacherattendance.js.map