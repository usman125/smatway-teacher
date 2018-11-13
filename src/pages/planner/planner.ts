import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, 
         LoadingController, 
         AlertController, 
         NavParams,
         ModalController, 
         ViewController,  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Calendar } from '@ionic-native/calendar';
// import { HttpErrorResponse } from '@angular/common/http';
import {PlannerService} from '../../services/planner.service';
import {HomePage} from '../../pages/home/home';

@Component({
  selector: 'all-planner',
  templateUrl: 'planner.html',
  providers: [PlannerService]
})
export class Planner {

  // date: any = new Date();
  // daysInThisMonth: any;
  // daysInLastMonth: any;
  // daysInNextMonth: any;
  // monthNames: string[];
  // currentMonth: any;
  // currentYear: any;
  // currentDate: any;
  loggedUser: any = null

  // eventList: any;
  // selectedEvent: any;
  // isSelected: any;

  // @ViewChild('template') template: any;

  // event = { title: "", location: "", message: "", startDate: "", endDate: "" };

  selectedDay = new Date()
  selectedDate: any;
  selectedObject
  eventSource = []
  viewTitle;
  modal: any;
  loader: any;
  isToday: boolean;
  calendarModes = [
    { key: 'month', value: 'Month' },
    { key: 'week', value: 'Week' },
    { key: 'day', value: 'Day' },
  ]
  calendar = {
    mode: this.calendarModes[0].key,
    currentDate: new Date()
  }; // these are the variable used by the calendar.

  constructor(
    public navCtrl: NavController,
    private _plannerService: PlannerService,
    public loadingController: LoadingController,  
    public modalCtrl: ModalController,  
    private storage: Storage) {
    // this.monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // this.getDaysOfMonth();
    // this.openCalendar()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      console.log("LOCAL STORAGE FROM EVENTS PLANNER:---", this.loggedUser)
      this.addEvent()  
    })
  }

  ionViewWillEnter() {
  }

  // getDaysOfMonth() {
  //   this.daysInThisMonth = [];
  //   this.daysInLastMonth = [];
  //   this.daysInNextMonth = [];
  //   this.currentMonth = this.monthNames[this.date.getMonth()];
  //   this.currentYear = this.date.getFullYear();
  //   if(this.date.getMonth() === new Date().getMonth()) {
  //     this.currentDate = new Date().getDate();
  //   } else {
  //     this.currentDate = 999;
  //   }

  //   var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
  //   var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
  //   for(var i = prevNumOfDays-(firstDayThisMonth-1); i <= prevNumOfDays; i++) {
  //     this.daysInLastMonth.push(i);
  //   }

  //   var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDate();
  //   for (var i = 0; i < thisNumOfDays; i++) {
  //     this.daysInThisMonth.push(i+1);
  //   }

  //   var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0).getDay();
  //   var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0).getDate();
  //   for (var i = 0; i < (6-lastDayThisMonth); i++) {
  //     this.daysInNextMonth.push(i+1);
  //   }
  //   var totalDays = this.daysInLastMonth.length+this.daysInThisMonth.length+this.daysInNextMonth.length;
  //   if(totalDays<36) {
  //     for(var i = (7-lastDayThisMonth); i < ((7-lastDayThisMonth)+7); i++) {
  //       this.daysInNextMonth.push(i);
  //     }
  //   }
  // }

  // goToLastMonth() {
  //   this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
  //   this.getDaysOfMonth();
  // }

  // goToNextMonth() {
  //   this.date = new Date(this.date.getFullYear(), this.date.getMonth()+2, 0);
  //   this.getDaysOfMonth();
  // }

  // loadEvents(){
  //   this._plannerService.allPlannerBySchoolId(this.loggedUser.teacher.schoolId)
  //   .subscribe(result => {
  //     console.log("RESULT FROM SCHOOL PLANNER:---"+result)
  //   })
  // }


  // loadEventThisMonth() {
  //   this.eventList = [];
  //   var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  //   var endDate = new Date(this.date.getFullYear(), this.date.getMonth()+1, 0);
  //   console.log("START DATE"+startDate+"END DATE"+endDate);
  //   this.calendar.hasReadWritePermission().then((result)=>{
  //     if(result === false){
  //         this.calendar.requestReadWritePermission().then((v)=>{
  //           this.calendar.listEventsInRange(startDate, endDate).then(data => {
  //               console.log("MESSAGE FROM INRANGE:---"+data)
  //               data.forEach(item => {
  //                 this.eventList.push(item);
  //               });
  //               // console.log(this.eventList, "LISTED EVENTS")
  //               // this.eventList = JSON.parse(data)
  //             },
  //             (err) => {
  //               console.log(err);
  //             }
  //           );
  //         },(r)=>{
  //             console.log("Rejected");
  //         })
  //     }else{
  //       this.calendar.listEventsInRange(startDate, endDate).then(
  //         (data) => {
  //           console.log("MESSAGE FROM INRANGE:---"+data)
  //           // msg.forEach(item => {
  //           //   this.eventList.push(item);
  //           // });
  //           // console.log(this.eventList, "LISTED EVENTS")
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   })
  // }

  // openCalendar(){
  //   this.calendar.openCalendar(new Date()).then(
  //     (msg) => { console.log(msg); },
  //     (err) => { console.log(err); }
  //   );
  // }

  // checkEvent(day) {
  //   var hasEvent = false;
  //   var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
  //   var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
  //   if (this.eventList){
  //     this.eventList.forEach(event => {
  //       if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
  //         hasEvent = true;
  //       }
  //     });
  //   }
  //   return hasEvent;
  // }

  // selectDate(day) {
  //   this.isSelected = false;
  //   this.selectedEvent = new Array();
  //   var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
  //   var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
  //   if (this.eventList){
  //     this.eventList.forEach(event => {
  //       if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
  //         this.isSelected = true;
  //         this.selectedEvent.push(event);
  //       }
  //     });
  //   }
  // }

  loadEvents() {
    //this.eventSource = this.createRandomEvents();
  }
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  onEventSelected(event) {
    console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
  }
  changeMode(mode) {
    this.calendar.mode = mode;
  }
  today() {
    this.calendar.currentDate = new Date();
  }
  onTimeSelected(ev) {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
    (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled, ev);
    this.selectedObject = ev
    // this.openActionSheet(ev)
    // this.eventSelected(ev.events[0])
  }
  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();

    this.selectedDay = event

  }

  onRangeChanged(ev) {
    console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
  }
  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return (date < current);
  };

  // openActionSheet(event) {
  //   console.log('opening');
  //   let actionsheet = this.actionSheetCtrl.create({
  //     title: "Choose Option",
  //     buttons: [
  //       {
  //         text: 'Block Date',
  //         handler: () => {
  //           console.log("Block Date Clicked: ", event);
  //           let d = event.selectedTime;
  //           //d.setHours(0, 0, 0);
  //           setTimeout(() => {
  //             this.blockDayEvent(d)
  //           }, 2);
  //         }
  //       },
  //       {
  //         text: 'Meet Up With',
  //         handler: function () {
  //           console.log("Meet Up With Clicked");
  //         }
  //       }
  //     ]
  //   }); actionsheet.present();
  // }

  blockDayEvent(date) {
    let startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    let endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    let events = this.eventSource;
    events.push({
      title: 'All Day ',
      startTime: startTime,
      endTime: endTime,
      allDay: true
    });
    this.eventSource = [];
    setTimeout(() => {
      this.eventSource = events;
    });
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'loading…'
    });
    this.loader.present();
  }

  addEvent() {
  //   let modal = this.modalCtrl.create(EventModalPage, { selectedDay: this.selectedDay });
  //   modal.present();
  //   modal.onDidDismiss(data => {
  //     if (data) {
  //       let eventData = data;

  //       eventData.startTime = new Date(data.startTime);
  //       eventData.endTime = new Date(data.endTime);

  //       let events = this.eventSource;
  //       events.push(eventData);
  //       this.eventSource = [];
  //       setTimeout(() => {
  //         this.eventSource = events;
  //       });
  //     }
  //   });
    this.presentLoading()
    this.eventSource = []
    this._plannerService.allPlannerBySchoolId(this.loggedUser.teacher.schoolId)
    .subscribe(result => {
      let events = this.eventSource;      
      for (let obj of result.planners){
        var event = {
          startTime: new Date(obj.startDate),
          endTime: new Date(obj.endDate),
          allDay: false,
          title: obj.title,
          type: obj.type,
          classes: obj.classes
        };
        events.push(event)
      }
      console.log("RESULT FROM SCHOOL PLANNER:---", result, '\n', events)
      this.eventSource = [];
      setTimeout(() => {
        this.eventSource = events;
        this.loader.dismissAll()
      });
    })
  }

  onOptionSelected($event: any) {
    console.log($event)
    //this.calendar.mode = $event
  }

  eventSelected(value){
    console.log("EVENT SELECTED:--", value)
    let modal = this.modalCtrl.create(EventDetail, { 'event': value });
    modal.present();
    // modal.onDidDismiss(data => {
    //   if (data) {
    //     let eventData = data;

    //     eventData.startTime = new Date(data.startTime);
    //     eventData.endTime = new Date(data.endTime);

    //     let events = this.eventSource;
    //     events.push(eventData);
    //     this.eventSource = [];
    //     setTimeout(() => {
    //       this.eventSource = events;
    //     });
    //   }
    // });
  }
}


@Component({
  selector: 'event-detail',
  template: `
  <!-- <ion-header>
    <ion-navbar>
      <ion-buttons start class="m-t-10">
        <button (click)="dismiss()" style="margin-right:10px;">
          <ion-icon name='close'></ion-icon>
        </button>
      </ion-buttons>
      <ion-title class="m-t-10">
        {{selectedEvent.title}}
      </ion-title>
    </ion-navbar>
  </ion-header> -->
  <ion-header>
    <ion-navbar color="primary">
      <ion-buttons start class="m-t-10">
        <button (click)="dismiss()" style="margin-right:10px;">
          <ion-icon name='close'></ion-icon>
        </button>
      </ion-buttons>
      <ion-title>{{selectedEvent.title}}</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <ion-row>
      <ion-col col-12 padding>
        <span class="header-title text-primary">START DATE</span>
        <br>
        <span>{{selectedEvent.startTime | date:'fullDate'}}</span>
        <br>
        <span>{{selectedEvent.startTime | date:'HH:mm a'}}</span>

      </ion-col>
      <ion-col col-12 padding>
        <span class="header-title text-primary">END DATE</span>
        <br>
        <span>{{selectedEvent.endTime | date:'fullDate'}}</span>
        <br>
        <span>{{selectedEvent.endTime | date:'HH:mm a'}}</span>
      </ion-col>
      <ion-col col-12 padding>
        <span class="header-title text-primary">Type</span>
        <br>
        <span *ngIf="selectedEvent.type === 1">Time Table</span>
        <span *ngIf="selectedEvent.type === 2">Event</span>
      </ion-col>
      <ion-col col-12 padding>
        <span class="header-title text-primary">Class(es)</span>
        <div class="classItems">
          <ion-chip color="light" *ngFor="let obj of selectedEvent.classes">
            <ion-label>{{obj.name}}</ion-label>
          </ion-chip>  
        </div>
      </ion-col>

    </ion-row>
  </ion-content>`
})

export class EventDetail {

  selectedEvent: any = null
  classes: any = null

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.selectedEvent = navParams.get('event')
    console.log('EVENT FROM MODAL:---\n', this.selectedEvent);
    if (this.selectedEvent.classes.length){
      this.classes = this.selectedEvent.classes[0]
    }
  }

  dismiss(){
    this.viewCtrl.dismiss()
  }
}