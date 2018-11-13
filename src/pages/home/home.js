var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { NavController, PopoverController, NavParams, LoadingController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import * as moment from "moment";
import { NotificationsPage } from "../notifications/notifications";
import { SettingsPage } from "../settings/settings";
import { TripsPage } from "../trips/trips";
import { Students } from "../students/students";
import { ClassAttendance } from "../classattendance/classattendance";
import { TeacherAttendance } from "../teacherattendance/teacherattendance";
import { StudentsService } from '../../services/students.service';
import { ClassesService } from '../../services/classes.service';
import { ClassAttendanceService } from '../../services/classattendance.service';
import { AssignmentsService } from '../../services/assignment.service';
import { Assignments } from '../assignments/assignments';
import { Planner } from '../planner/planner';
var HomePage = /** @class */ (function () {
    function HomePage(storage, navParams, _studentsService, loadingController, _classesService, _assignmentsService, _classAttendanceService, nav, popoverCtrl) {
        this.storage = storage;
        this.navParams = navParams;
        this._studentsService = _studentsService;
        this.loadingController = loadingController;
        this._classesService = _classesService;
        this._assignmentsService = _assignmentsService;
        this._classAttendanceService = _classAttendanceService;
        this.nav = nav;
        this.popoverCtrl = popoverCtrl;
        // search condition
        this.search = {
            name: "Rio de Janeiro, Brazil",
            date: new Date().toISOString()
        };
        this.selectedClass = null;
        this.classStudents = null;
        this.loggedUser = null;
        this.loader = null;
        this.presentCount = 0;
        this.absentCount = 0;
        this.presentTeacherCount = 0;
        this.absentTeacherCount = 0;
        this.assignmentsCount = 0;
        this.allAttendances = [];
    }
    HomePage.prototype.ionViewWillEnter = function () {
        var _this = this;
        var created_at = this.getDate();
        this.presentLoading();
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.selectedClass = _this.navParams.get('classObject');
            _this._studentsService.allStudentsByClassId(_this.selectedClass.id)
                .subscribe(function (result) {
                _this.classStudents = result.students;
                console.log("SELCTED CLASS AFETR SELCT:===\n", _this.selectedClass, _this.selectedClass.id);
                _this.getClassAttendanceByDate(created_at);
                _this.getTeacherMonthAttendance(_this.loggedUser.teacher.id, _this.getMonth(), _this.getYear());
                _this.getClassAssignments(_this.selectedClass.id);
                _this.loader.dismissAll();
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    HomePage.prototype.getDate = function () {
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
        // fullDate = year+'-'+month+'-'+day
        var created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
        return created_at;
    };
    HomePage.prototype.getMonth = function () {
        var month = moment().format('M');
        return month;
    };
    HomePage.prototype.getYear = function () {
        var year = moment().format('YYYY');
        return year;
    };
    HomePage.prototype.getClassAttendanceByDate = function (created_at) {
        var _this = this;
        console.log("OPTION TO FECTCH FOR CLASS TODAY:--", created_at, this.selectedClass.id);
        this._classAttendanceService.getTodayClassAttendance(created_at, this.selectedClass.id)
            .subscribe(function (result) {
            console.log('RESULT FROM CLASS ATTENDANCE:--\n', result);
            var presentCount = 0;
            var absentCount = 0;
            if (result.status) {
                for (var _i = 0, _a = result.attendance; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    if (obj.isPresent)
                        presentCount++;
                    else
                        absentCount++;
                }
            }
            _this.presentCount = presentCount;
            _this.absentCount = absentCount;
        });
    };
    HomePage.prototype.getClassAssignments = function (classId) {
        var _this = this;
        this._assignmentsService.allAssignmentsByClassId(classId)
            .subscribe(function (result) {
            console.log('RESULT FROM CLASS ASSIGNMENTS:--\n', result);
            var assignmentsCount = 0;
            var absentCount = 0;
            if (result.status) {
                _this.assignmentsCount = result.assignments.length;
            }
        });
    };
    HomePage.prototype.getTeacherMonthAttendance = function (teacherId, month, year) {
        var _this = this;
        console.log("OPTION TO FECTCH FROM TEACHER MONTH:--", teacherId, month, year);
        this._classAttendanceService.getTeacherMonthAttendance(teacherId, month, year)
            .subscribe(function (result) {
            var presentCount = 0;
            var absentCount = 0;
            if (result.status) {
                for (var _i = 0, _a = result.attendances; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    if (obj.isPresent)
                        presentCount++;
                    else
                        absentCount++;
                }
                _this.allAttendances = result.attendances;
            }
            // var allAttendances = _.groupBy(result.attendances, 'dateCreated');
            // var allAttendances = _.chain(result.attendances)
            // .groupBy("dateCreated")
            // .toPairs()
            // .map(function(currentItem) {
            //     return _.zipObject(["dateCreated", "users"], currentItem);
            // })
            // .value();
            console.log('\nRESULT FROM TEACHER MONTH ATTENDANCE:--\n', result, '\n', _this.allAttendances);
            _this.presentTeacherCount = presentCount;
            _this.absentTeacherCount = absentCount;
        });
    };
    HomePage.prototype.presentLoading = function () {
        this.loader = this.loadingController.create({
            content: 'loading…'
        });
        this.loader.present();
    };
    // go to result page
    HomePage.prototype.doSearch = function () {
        this.nav.push(TripsPage);
    };
    // choose students
    HomePage.prototype.goToStudents = function () {
        this.nav.push(Students, { 'students': this.classStudents });
    };
    // CLass Attendance
    HomePage.prototype.goToClassAttendance = function () {
        this.nav.push(ClassAttendance, { 'students': this.classStudents,
            'pagefor': 'student',
            'classId': this.selectedClass.id });
    };
    // teacher Attendance
    HomePage.prototype.goToTeacherAttendance = function () {
        this.nav.push(TeacherAttendance, { 'attendances': this.allAttendances });
    };
    // Assignments Attendance
    HomePage.prototype.goToAssignments = function () {
        this.nav.push(Assignments, { 'classId': this.selectedClass.id });
    };
    // Planner
    HomePage.prototype.goToPlanner = function () {
        this.nav.push(Planner, { 'classId': this.selectedClass.id });
    };
    // to go account page
    HomePage.prototype.goToAccount = function () {
        this.nav.push(SettingsPage);
    };
    HomePage.prototype.presentNotifications = function (myEvent) {
        console.log(myEvent);
        var popover = this.popoverCtrl.create(NotificationsPage);
        popover.present({
            ev: myEvent
        });
    };
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html',
            providers: [StudentsService, ClassesService, ClassAttendanceService, AssignmentsService]
        }),
        __metadata("design:paramtypes", [Storage,
            NavParams,
            StudentsService,
            LoadingController,
            ClassesService,
            AssignmentsService,
            ClassAttendanceService,
            NavController,
            PopoverController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//
//# sourceMappingURL=home.js.map