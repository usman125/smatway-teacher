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
var ClassAttendance = /** @class */ (function () {
    function ClassAttendance(navCtrl, navParams, _classAttendanceService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this._classAttendanceService = _classAttendanceService;
        this.storage = storage;
        this.allStudents = [];
        this.loggedUser = null;
        this.classId = null;
        this.todayAttendance = null;
        this.disableBtn = false;
    }
    ClassAttendance.prototype.ionViewWillEnter = function () {
        var _this = this;
        var created_at = this.getDate();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.allStudents = _this.navParams.get('students');
            _this.classId = _this.navParams.get('classId');
            console.log("LOCAL STORAGE FROM CLASS ATTENDANCE:---\n", _this.loggedUser, "\nSTUDENTS FROM CLASS ATTENDANCE PARAMS:---\n", _this.allStudents, "\nCLASS ID:---\n", _this.classId);
            _this.getAttendanceByDate(created_at);
        });
    };
    ClassAttendance.prototype.getDate = function () {
        var day = new Date().getDate();
        var month = new Date().getMonth();
        var year = new Date().getFullYear();
        var fullDate = null;
        var attendanceStudents = [];
        if (month + 1 < 10) {
            fullDate = year + '-0' + (month + 1) + '-' + day;
        }
        else {
            fullDate = year + '-' + (month + 1) + '-' + day;
        }
        var created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
        return created_at;
    };
    ClassAttendance.prototype.getAttendanceByDate = function (created_at) {
        var _this = this;
        console.log("OPTION TO FECTCH:--", created_at, this.classId);
        this._classAttendanceService.getTodayClassAttendance(created_at, this.classId)
            .subscribe(function (result) {
            console.log('RESULT FROM CLASS ATTENDANCE:--\n', result);
            if (!result.status) {
                if (_this.allStudents) {
                    for (var _i = 0, _a = _this.allStudents; _i < _a.length; _i++) {
                        var student = _a[_i];
                        student.isPresent = false;
                        student.disabled = false;
                    }
                }
                _this.disableBtn = false;
            }
            else {
                if (_this.allStudents) {
                    var attendances = result.attendance;
                    for (var _b = 0, _c = _this.allStudents; _b < _c.length; _b++) {
                        var student = _c[_b];
                        var key = _.filter(attendances, { 'studentId': student.id });
                        student.isPresent = key[0].isPresent;
                        student.disabled = true;
                    }
                }
                _this.disableBtn = true;
            }
        });
    };
    ClassAttendance.prototype.submitAttendance = function () {
        var _this = this;
        var attendanceStudents = [];
        var created_at = this.getDate();
        for (var _i = 0, _a = this.allStudents; _i < _a.length; _i++) {
            var student = _a[_i];
            var object = {
                'id': student.id,
                'isPresent': student.isPresent
            };
            attendanceStudents.push(object);
        }
        var attendance = {
            'classId': this.classId,
            'students': attendanceStudents,
            'date': created_at
        };
        console.log("ATTENDANCE OBJECT TO PUSH:--\n", attendance);
        this._classAttendanceService.addAttendance(attendance)
            .subscribe(function (result) {
            console.log("RESILT FROM ADDING ATTENDANCE:---\n", result);
            if (result.status) {
                _this.disableBtn = true;
            }
        });
    };
    ClassAttendance = __decorate([
        Component({
            selector: 'class-attendance',
            templateUrl: 'classattendance.html',
            providers: [ClassAttendanceService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ClassAttendanceService,
            Storage])
    ], ClassAttendance);
    return ClassAttendance;
}());
export { ClassAttendance };
//# sourceMappingURL=classattendance.js.map