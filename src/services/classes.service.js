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
// import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
var ClassesService = /** @class */ (function () {
    function ClassesService(http, 
    // private _router: Router, 
    _httpClient, _compiler) {
        this.http = http;
        this._httpClient = _httpClient;
        this._compiler = _compiler;
    }
    ClassesService.prototype.addClass = function (obj) {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*'
        });
        var body = new HttpParams()
            .set('schoolId', obj.schoolId)
            .set('teacherId', obj.teacher)
            .set('subjectId', obj.subject)
            .set('name', obj.name)
            .set('section', obj.section);
        // .set('studentIds', obj.students);
        obj.students.forEach(function (id) {
            body = body.append('studentIds[]', id);
        });
        var options = new RequestOptions({ headers: headers });
        console.log("Login service called", body.toString());
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/create', body.toString(), options)
            .map(function (res) { return res.json(); });
    };
    ClassesService.prototype.editClass = function (obj) {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json, text/plain, */*'
        });
        var options = new RequestOptions({ headers: headers });
        var body = new HttpParams()
            .set('classId', obj.classId)
            .set('teacherId', obj.teacher)
            .set('subjectId', obj.subject)
            .set('name', obj.name)
            .set('section', obj.section)
            .set('isActive', obj.isActive);
        obj.students.forEach(function (id) {
            body = body.append('studentIds[]', id);
        });
        console.log("edit class service called\n", body);
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/update', body.toString(), options)
            .map(function (res) { return res.json(); });
    };
    ClassesService.prototype.allClassesBySchool = function (schoolId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/school/' + schoolId)
            .map(function (res) { return res.json(); });
    };
    ClassesService.prototype.allClassesByTeacherId = function (teacherId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/teacher/' + teacherId)
            .map(function (res) { return res.json(); });
    };
    ClassesService.prototype.allClassesCountBySchool = function (schoolId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/count/school/' + schoolId)
            .map(function (res) { return res.json(); });
    };
    ClassesService.prototype.getClassById = function (classId) {
        // console.log("USER ID FROM AUTH USER: ", userId);
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/' + classId)
            .map(function (res) { return res.json(); });
    };
    ClassesService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            HttpClient,
            Compiler])
    ], ClassesService);
    return ClassesService;
}());
export { ClassesService };
//# sourceMappingURL=classes.service.js.map