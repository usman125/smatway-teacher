import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Events } from "ionic-angular";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { HomePage } from "../pages/home/home";
import { SelectClass } from "../pages/selectclass/selectclass";
import { LoginPage } from "../pages/login/login";
import { LocalWeatherPage } from "../pages/local-weather/local-weather";
import { Storage } from '@ionic/storage';
import {Planner} from '../pages/planner/planner';
import {TeacherAttendance} from "../pages/teacherattendance/teacherattendance";
import {ClassDashboard} from "../pages/classdashboard/classdashboard";
import {ClassActivity} from "../pages/classactivity/classactivity";
import {Assignments} from "../pages/assignments/assignments";
import {Inbox} from "../pages/inbox/inbox";

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  appMenuItems: Array<MenuItem>;
  loggedUser: any = null
  selectedClassName: any = null
  selectedClass: any = null
  attendeStudents: any = null
  noAttend: any = null
  noAttendName: any = null

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public Events: Events,
    public _storage: Storage,
    public keyboard: Keyboard) {
    //*** Control Status Bar
    this.appMenuItems = [
      {title: 'Account', component: LocalWeatherPage, icon: 'contact'}
    ];
    Events.subscribe('user:created', (user, time) => {
      console.log('Welcome', user, 'at', time);
      this.loggedUser = user
      if (this.appMenuItems.length < 5){
        this.appMenuItems.push({title: 'Select Class', component: SelectClass, icon: 'people'})
        this.appMenuItems.push({title: 'Planner', component: Planner, icon: 'calendar'})
        this.appMenuItems.push({title: 'My Attendance', component: TeacherAttendance, icon: 'clock'})
        this.appMenuItems.push({title: 'Inbox', component: Inbox, icon: 'mail-open'})
      }
    });
    Events.subscribe('class:selected', (cliceked) => {
      console.log('USER CLICK FORM STIDENTS:*********\n', cliceked);
      this.selectedClass = cliceked
      if (cliceked){
        this.selectedClassName = cliceked.name
        Events.subscribe('class:home', (classSelected, homeStudents) => {
          // this.selectedClass = classSelected
          this.attendeStudents = homeStudents
        })
      }else{
        this.selectedClassName = null
        Events.subscribe('class:noattend', (tempClass, checkFlag) => {
          // this.selectedClassName = tempClass.name
          if (tempClass)
            this.noAttendName = tempClass.name
          else
            this.noAttendName = null
          this.noAttend = checkFlag
        })
      }
    });
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
        // this.getUser()
      //*** Control Splash Screen
      // this.splashScreen.show();
      // this.splashScreen.hide();


      //*** Control Keyboard
      // this.keyboard.disableScroll(true);
    });
  }


  goToActvities(){
    this.nav.setRoot(ClassActivity, {'classObject': this.selectedClass})
  }

  goToAssignments(){
    this.nav.setRoot(Assignments, {'classObject': this.selectedClass})
  }

  goToHome(){
    this.nav.setRoot(HomePage, {'classObject': this.selectedClass, 'attendeStudents': this.attendeStudents})
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // if (page.title == 'Planner'){
    //   this.nav.push(page.component);
    // }else if (page.title == 'My Attendance'){
    //   this.nav.push(page.component);
    // }else if (page.title == 'Inbox'){
    //   this.nav.push(page.component);
    // }
    // else{
      this.nav.setRoot(page.component);
    // }
  }

  goToDashboard(){
    this.nav.setRoot(ClassDashboard, {'classObject': this.selectedClass});
  }

  logout() {
    this._storage.remove('user')
    // window.location.reload
    this.nav.setRoot(LoginPage);

  }

}
