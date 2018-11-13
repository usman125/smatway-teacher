import {NgModule, ErrorHandler} from "@angular/core";
import {IonicApp, IonicModule, IonicErrorHandler} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';

import {ActivityService} from "../services/activity-service";
import {TripService} from "../services/trip-service";
import {WeatherProvider} from "../services/weather";

import {MyApp} from "./app.component";

import {SettingsPage} from "../pages/settings/settings";
import {CheckoutTripPage} from "../pages/checkout-trip/checkout-trip";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {NotificationsPage} from "../pages/notifications/notifications";
import {RegisterPage} from "../pages/register/register";
import {SearchLocationPage} from "../pages/search-location/search-location";
import {TripDetailPage} from "../pages/trip-detail/trip-detail";
import {TripsPage} from "../pages/trips/trips";
import {LocalWeatherPage} from "../pages/local-weather/local-weather";
import {SelectClass} from "../pages/selectclass/selectclass";
import {Students} from "../pages/students/students";
import {SingleStudent} from "../pages/student-detail/student-detail";
import {ClassAttendance} from "../pages/classattendance/classattendance";
import {TeacherAttendance} from "../pages/teacherattendance/teacherattendance";
import {StudentPerformance, Profile} from "../pages/studentperformance/studentperformance";
import {Assignments} from "../pages/assignments/assignments";
import {AddAssignment} from "../pages/addassignments/addassignments";
import {AddStudentActivity} from "../pages/addstudentactivity/addstudentactivity";
import {SingleAssignment} from "../pages/singleassignment/singleassignment";
import {StudentActivity} from "../pages/studentactivity/studentactivity";
import {ClassActivity} from "../pages/classactivity/classactivity";
import {AddClassActivity} from "../pages/addclassactivity/addclassactivity";
import {StudentAssignments} from "../pages/studentassignment/studentassignment";
import {Planner, EventDetail} from "../pages/planner/planner";
import {ClassDashboard} from "../pages/classdashboard/classdashboard";
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import services
// end import services
// end import services

// import pages
// end import pages

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';

import { MediaCapture} from '@ionic-native/media-capture';
import { StreamingMedia} from '@ionic-native/streaming-media';
import { FileChooser } from '@ionic-native/file-chooser';
import { Transfer } from '@ionic-native/transfer';
import { Calendar } from '@ionic-native/calendar';

// calendar
import { NgCalendarModule  } from 'ionic2-calendar';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    SelectClass,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    Students,
    SingleStudent,
    ClassAttendance,
    TeacherAttendance,
    StudentPerformance,
    Assignments,
    AddAssignment,
    StudentActivity,
    SingleAssignment,
    AddStudentActivity,
    Profile,
    Planner,
    EventDetail,
    StudentAssignments,
    TripsPage,
    ClassActivity,
    AddClassActivity,
    ClassDashboard,
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    Ionic2RatingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SelectClass,
    StudentActivity,
    AddStudentActivity,
    SingleAssignment,
    Students,
    SingleStudent,
    ClassAttendance,
    TeacherAttendance,
    StudentPerformance,
    Assignments,
    AddAssignment,
    MyApp,
    SettingsPage,
    CheckoutTripPage,
    HomePage,
    LoginPage,
    LocalWeatherPage,
    NotificationsPage,
    RegisterPage,
    SearchLocationPage,
    TripDetailPage,
    Profile,
    Planner,
    EventDetail,
    StudentAssignments,
    TripsPage,
    ClassActivity,
    AddClassActivity,
    ClassDashboard,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    ActivityService,
    TripService,
    FileTransfer,
    FileTransferObject,
    File,
    Camera,
    WeatherProvider,
    MediaCapture,
    FileChooser,
    Transfer,
    Calendar,
    StreamingMedia,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule {
}
