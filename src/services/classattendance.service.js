var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, Compiler } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
var ClassAttendanceService = /** @class */ (function () {
    function ClassAttendanceService(http, 
    // private _router: Router, 
    _httpClient, _compiler) {
        this.http = http;
        this._httpClient = _httpClient;
        this._compiler = _compiler;
    }
    ClassAttendanceService.prototype.addAttendance = function (attendance) {
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/attendance/mark/', { 'classId': attendance.classId,
            'date': attendance.date,
            'students': attendance.students })
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService.prototype.getTodayClassAttendance = function (date, classId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/attendance/getbydate/?date=' + date + '&classId=' + classId)
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService.prototype.addTeacherAttendance = function (attendance) {
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/mark/', { 'teacherId': attendance.teacherId,
            'date': attendance.date,
            'isPresent': attendance.isPresent })
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService.prototype.getTodayTeacherAttendance = function (date, teacherId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/getbydate/?date=' + date + '&teacherId=' + teacherId)
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService.prototype.getTeacherMonthAttendance = function (teacherId, month, year) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/get/teacher/' + teacherId + '/month/' + month + '/year/' + year)
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService.prototype.getStudentMonthAttendance = function (studentId, month, year) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/attendance/get/student/' + studentId + '/month/' + month + '/year/' + year)
            .map(function (res) { return res.json(); });
    };
    ClassAttendanceService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            HttpClient,
            Compiler])
    ], ClassAttendanceService);
    return ClassAttendanceService;
}());
export { ClassAttendanceService };
//# sourceMappingURL=classattendance.service.js.map