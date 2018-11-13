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
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
var StudentsService = /** @class */ (function () {
    function StudentsService(http, _httpClient, _compiler) {
        this.http = http;
        this._httpClient = _httpClient;
        this._compiler = _compiler;
    }
    StudentsService.prototype.addStudent = function (student) {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*'
        });
        var options = new RequestOptions({ headers: headers });
        var newSchool = {
            'schoolId': student.schoolId,
            'studentName': student.name,
            'studentPassportNo': student.passportno,
            'studentNationality': student.nationality,
            'studentAddress': student.address,
            'studentRegistrationDate': student.joindate,
            'studentSchoolIdentityNo': student.schoolregid,
            'studentDateOfBirth': student.dob,
            'studentAge': student.age,
            'parentName': student.pname,
            'parentPassportNo': student.ppassportno,
            'relationWithStudent': student.prelation,
            'parentPhone': student.pphone,
            'parentMobile': student.pmobile,
            'parentAddress': student.paddress,
            'studentImage': student.studentImage,
            'parentNationality': student.pnationality,
            'username': student.username,
            'password': student.password,
        };
        console.log("NEW STDUENT CALLED:---\n", newSchool);
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/create', newSchool)
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.editStudent = function (student) {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*'
        });
        var options = new RequestOptions({ headers: headers });
        var body = new HttpParams()
            .set('studentId', student.studentId)
            .set('studentName', student.name)
            .set('studentPassportNo', student.passportno)
            .set('studentNationality', student.nationality)
            .set('studentAddress', student.address)
            .set('studentRegistrationDate', student.joindate)
            .set('studentSchoolIdentityNo', student.schoolregid)
            .set('studentDateOfBirth', student.dob)
            .set('studentAge', student.age)
            .set('studentIsActive', student.studentIsActive)
            .set('parentId', student.parentId)
            .set('parentName', student.pname)
            .set('parentPassportNo', student.ppassportno)
            .set('relationWithStudent', student.prelation)
            .set('parentPhone', student.pphone)
            .set('parentMobile', student.pmobile)
            .set('parentAddress', student.paddress)
            .set('parentNationality', student.pnationality)
            .set('parentIsActive', student.parentIsActive);
        console.log("edit student service called\n", body);
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/update', body.toString(), options)
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.allStudents = function () {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/all')
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.getStudentById = function (studentId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/' + studentId)
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.allStudentsBySchool = function (schoolId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/all/' + schoolId)
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.allStudentsByClassId = function (ClassId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/class/' + ClassId)
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.allStudentsCount = function () {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/count')
            .map(function (res) { return res.json(); });
    };
    StudentsService.prototype.allStudentsCountBySchool = function (schoolId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/count/' + schoolId)
            .map(function (res) { return res.json(); });
    };
    StudentsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            HttpClient,
            Compiler])
    ], StudentsService);
    return StudentsService;
}());
export { StudentsService };
//# sourceMappingURL=students.service.js.map