var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';
// import { HttpErrorResponse } from '@angular/common/http';
import { PlannerService } from '../../services/planner.service';
var Planner = /** @class */ (function () {
    function Planner(navCtrl, _plannerService, loadingController, calendar, storage) {
        this.navCtrl = navCtrl;
        this._plannerService = _plannerService;
        this.loadingController = loadingController;
        this.calendar = calendar;
        this.storage = storage;
        this.date = new Date();
        this.loggedUser = null;
        this.event = { title: "", location: "", message: "", startDate: "", endDate: "" };
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.getDaysOfMonth();
        this.openCalendar();
    }
    Planner.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            console.log("LOCAL STORAGE FROM EVENTS PLANNER:---", _this.loggedUser);
        });
    };
    Planner.prototype.getDaysOfMonth = function () {
        this.daysInThisMonth = [];
        this.daysInLastMonth = [];
        this.daysInNextMonth = [];
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        if (this.date.getMonth() === new Date().getMonth()) {
            this.currentDate = new Date().getDate();
        }
        else {
            this.currentDate = 999;
        }
        var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
        var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
        for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
            this.daysInLastMonth.push(i);
        }
        var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
        for (var i = 0; i < thisNumOfDays; i++) {
            this.daysInThisMonth.push(i + 1);
        }
        var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
        var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
        for (var i = 0; i < (6 - lastDayThisMonth); i++) {
            this.daysInNextMonth.push(i + 1);
        }
        var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
        if (totalDays < 36) {
            for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
                this.daysInNextMonth.push(i);
            }
        }
    };
    Planner.prototype.goToLastMonth = function () {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
        this.getDaysOfMonth();
    };
    Planner.prototype.goToNextMonth = function () {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
        this.getDaysOfMonth();
    };
    Planner.prototype.loadEvents = function () {
        var _this = this;
        this._plannerService.allPlannerBySchoolId(this.loggedUser.teacher.schoolId)
            .subscribe(function (result) {
            // this.loadEventThisMonth()
            console.log("RESULT FROM SCHOOL PLANNER:---" + result);
            for (var _i = 0, _a = result.planners; _i < _a.length; _i++) {
                var obj = _a[_i];
                _this.calendar.createEvent(obj.title, _this.event.location, _this.event.message, new Date(obj.startDate), new Date(obj.endDate))
                    .then(function (msg) {
                    console.log(msg + "----CREATED SUCCESULLY:---");
                }, function (err) {
                    console.log(err);
                });
            }
            _this.loadEventThisMonth();
        });
    };
    Planner.prototype.loadEventThisMonth = function () {
        var _this = this;
        this.eventList = [];
        var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        var endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
        console.log("START DATE" + startDate + "END DATE" + endDate);
        this.calendar.hasReadWritePermission().then(function (result) {
            if (result === false) {
                _this.calendar.requestReadWritePermission().then(function (v) {
                    _this.calendar.listEventsInRange(startDate, endDate).then(function (data) {
                        console.log("MESSAGE FROM INRANGE:---" + data);
                        data.forEach(function (item) {
                            _this.eventList.push(item);
                        });
                        // console.log(this.eventList, "LISTED EVENTS")
                        // this.eventList = JSON.parse(data)
                    }, function (err) {
                        console.log(err);
                    });
                }, function (r) {
                    console.log("Rejected");
                });
            }
            else {
                _this.calendar.listEventsInRange(startDate, endDate).then(function (data) {
                    console.log("MESSAGE FROM INRANGE:---" + data);
                    // msg.forEach(item => {
                    //   this.eventList.push(item);
                    // });
                    // console.log(this.eventList, "LISTED EVENTS")
                }, function (err) {
                    console.log(err);
                });
            }
        });
    };
    Planner.prototype.openCalendar = function () {
        this.calendar.openCalendar(new Date()).then(function (msg) { console.log(msg); }, function (err) { console.log(err); });
    };
    Planner.prototype.checkEvent = function (day) {
        var hasEvent = false;
        var thisDate1 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00";
        var thisDate2 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59";
        if (this.eventList) {
            this.eventList.forEach(function (event) {
                if (((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
                    hasEvent = true;
                }
            });
        }
        return hasEvent;
    };
    Planner.prototype.selectDate = function (day) {
        var _this = this;
        this.isSelected = false;
        this.selectedEvent = new Array();
        var thisDate1 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00";
        var thisDate2 = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59";
        if (this.eventList) {
            this.eventList.forEach(function (event) {
                if (((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
                    _this.isSelected = true;
                    _this.selectedEvent.push(event);
                }
            });
        }
    };
    __decorate([
        ViewChild('otherDate'),
        __metadata("design:type", Object)
    ], Planner.prototype, "otherDate", void 0);
    Planner = __decorate([
        Component({
            selector: 'all-planner',
            templateUrl: 'planner.html',
            providers: [PlannerService]
        }),
        __metadata("design:paramtypes", [NavController,
            PlannerService,
            LoadingController,
            Calendar,
            Storage])
    ], Planner);
    return Planner;
}());
export { Planner };
//# sourceMappingURL=planner.js.map