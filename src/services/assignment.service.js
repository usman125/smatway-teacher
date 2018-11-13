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
var AssignmentsService = /** @class */ (function () {
    function AssignmentsService(http, 
    // private _router: Router, 
    _httpClient, _compiler) {
        this.http = http;
        this._httpClient = _httpClient;
        this._compiler = _compiler;
    }
    AssignmentsService.prototype.addAssignment = function (assignment) {
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/assignments/create', { 'teacherId': assignment.teacherId,
            'classId': assignment.classId,
            'title': assignment.title,
            'submissionDate': assignment.submissionDate })
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.markAssignment = function (assignment) {
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/assignments/mark', { 'assignmentId': assignment.assignmentId,
            'students': assignment.students, })
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.getAssignmentById = function (assignmentId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/assignments/get/' + assignmentId)
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.allAssignmentsByClassId = function (classId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/assignments/get/class/' + classId)
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.allActivitiesByStudentId = function (studentId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net//api/activities/get/student/' + studentId)
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.markOverallPerformance = function (performance) {
        return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/overall/evaluation/create', { 'studentId': performance.studentId,
            'response': performance.response,
            'writing': performance.writing,
            'listening': performance.listening,
            'speaking': performance.speaking,
            'reading': performance.reading })
            .map(function (res) { return res.json(); });
    };
    AssignmentsService.prototype.getOverallPerformance = function (studentId) {
        return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/overall/evaluation/get/' + studentId)
            .map(function (res) { return res.json(); });
    };
    AssignmentsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http,
            HttpClient,
            Compiler])
    ], AssignmentsService);
    return AssignmentsService;
}());
export { AssignmentsService };
//# sourceMappingURL=assignment.service.js.map