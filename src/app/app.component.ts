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

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public Events: Events,
    public _storage: Storage,
    public keyboard: Keyboard
  ) {
        //*** Control Status Bar
        this.appMenuItems = [
          // {title: 'Home', component: HomePage, icon: 'home'},
          {title: 'Account', component: LocalWeatherPage, icon: 'contact'}
        ];
        Events.subscribe('user:created', (user, time) => {
          // user and time are the same arguments passed in `events.publish(user, time)`
          console.log('Welcome', user, 'at', time);
          this.loggedUser = user
          if (this.appMenuItems.length < 4){
            this.appMenuItems.push({title: 'Select Class', component: SelectClass, icon: 'people'})
            this.appMenuItems.push({title: 'Planner', component: Planner, icon: 'calendar'})
            this.appMenuItems.push({title: 'My Attendance', component: TeacherAttendance, icon: 'clock'})
          }
        });
        Events.subscribe('class:selected', (cliceked) => {
          console.log('USER CLICK FORM STIDENTS:*********\n', cliceked);
          this.selectedClass = cliceked
          if (cliceked){
            this.selectedClassName = cliceked.name
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

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.title == 'Planner'){
      this.nav.push(page.component);
    }else if (page.title == 'My Attendance'){
      this.nav.push(page.component);
    }
    else{
      this.nav.setRoot(page.component);
    }
  }

  goToDashboard(){
    this.nav.push(ClassDashboard, {'classObject': this.selectedClass});
  }

  logout() {
    this._storage.remove('user')
    // window.location.reload
    this.nav.setRoot(LoginPage);

  }

}
