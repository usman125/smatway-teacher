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
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
// import {ClassAttendanceService} from '../../services/classattendance.service'
import { AssignmentsService } from '../../services/assignment.service';
import { AddAssignment } from '../addassignments/addassignments';
import { SingleAssignment } from '../singleassignment/singleassignment';
var Assignments = /** @class */ (function () {
    function Assignments(navCtrl, navParams, modalCtrl, _assignmentsService, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.modalCtrl = modalCtrl;
        this._assignmentsService = _assignmentsService;
        this.storage = storage;
        this.loggedUser = null;
        this.classId = null;
        this.allAssigns = null;
    }
    Assignments.prototype.ionViewWillEnter = function () {
        var _this = this;
        var created_at = this.getDate();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            // this.allStudents = this.navParams.get('students')
            _this.classId = _this.navParams.get('classId');
            console.log("LOCAL STORAGE FROM ASSIGNMENTS:---\n", _this.loggedUser, "\nCLASS ID:---\n", _this.classId);
            _this._assignmentsService.allAssignmentsByClassId(_this.classId)
                .subscribe(function (result) {
                console.log("RESULT FROM ALL TEACHER ASSIGNMENTS:---\n", result);
                _this.allAssigns = result.assignments;
            });
        });
    };
    Assignments.prototype.getDate = function () {
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
    Assignments.prototype.addModel = function () {
        this.navCtrl.push(AddAssignment, { 'classId': this.classId });
    };
    Assignments.prototype.getAssignment = function (assignment) {
        console.log("ASSIGNMENT TO GET:---\n", assignment);
        this.navCtrl.push(SingleAssignment, { 'classId': this.classId, 'assignment': assignment });
    };
    Assignments = __decorate([
        Component({
            selector: 'all-assignments',
            templateUrl: 'assignments.html',
            providers: [AssignmentsService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            ModalController,
            AssignmentsService,
            Storage])
    ], Assignments);
    return Assignments;
}());
export { Assignments };
//# sourceMappingURL=assignments.js.map