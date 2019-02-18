import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// import { HttpErrorResponse } from '@angular/common/http';
import {ClassesService} from '../../services/classes.service';
import {HomePage} from '../../pages/home/home';
import {ClassAttendance} from "../classattendance/classattendance";

@Component({
  selector: 'select-class',
  templateUrl: 'selectclass.html',
  providers: [ClassesService]
})
export class SelectClass {

  classselect: any;
  allClasses: any = []
  loggedUser: any = null
  loader: any = null

  constructor(
    public navCtrl: NavController,
    private _classesService: ClassesService,
    public loadingController: LoadingController,  
    public Events: Events,  
    private storage: Storage) {
  }

  ionViewWillEnter() {
    this.presentLoading()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      console.log("LOCAL STORAGE FROM SELCT CLASS:---", this.loggedUser)  
      this._classesService.allClassesByTeacherId(this.loggedUser.teacher.id)
      .subscribe(result => {
        this.allClasses = result.classes
        console.log("ALL CLASSES OF TEACHER:---", this.allClasses)  
        this.loader.dismissAll()
        this.Events.publish('class:selected', null);
        this.Events.publish('class:noattend', null, false);
      })
    })
  }

  public getClass(classobject) {
    // console.log("VALLUE FROM SLECTING CALSS:---\n", classobject);
    // this.navCtrl.setRoot(HomePage, {'classObject': classobject})
    this.navCtrl.setRoot(ClassAttendance, {'classObject': classobject})
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'loading…'
    });
    this.loader.present();
  }

}
