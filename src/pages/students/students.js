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
// import { HttpErrorResponse } from '@angular/common/http';
// import {ClassesService} from '../../services/classes.service';
import { SingleStudent } from '../../pages/student-detail/student-detail';
var Students = /** @class */ (function () {
    function Students(navCtrl, navParams, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.storage = storage;
        // classselect: any;
        this.allStudents = [];
        this.loggedUser = null;
    }
    Students.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.storage.get('user').then(function (val) {
            _this.loggedUser = JSON.parse(val);
            _this.allStudents = _this.navParams.get('students');
            console.log("LOCAL STORAGE FROM STUDENTS:---\n", _this.loggedUser, "\nSTUDENTS FROM PARAMS:---\n", _this.allStudents);
            // this._classesService.allClassesByTeacherId(this.loggedUser.teacher.id)
            // .subscribe(result => {
            //   this.allClasses = result.classes
            //   console.log("ALL CLASSES OF TEACHER:---", this.allClasses)  
            // })
        });
    };
    Students.prototype.getStudent = function (student) {
        // console.log("VALLUE FROM SLECTING CALSS:---\n", classobject);
        this.navCtrl.push(SingleStudent, { 'student': student });
    };
    Students = __decorate([
        Component({
            selector: 'all-students',
            templateUrl: 'students.html',
            providers: []
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            Storage])
    ], Students);
    return Students;
}());
export { Students };
//# sourceMappingURL=students.js.map