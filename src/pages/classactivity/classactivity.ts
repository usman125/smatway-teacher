import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {AddClassActivity} from "../addclassactivity/addclassactivity";
import {AssignmentsService} from '../../services/assignment.service';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';

@Component({
  selector: 'class-activity',
  templateUrl: 'classactivity.html',
  providers: [AssignmentsService]
})

export class ClassActivity {

  selectedClass: any;
  loggedUser: any = null
  allActivites: any = null
  loader: any = null
  @ViewChild('myvideo') myVideo: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _assignmentsService: AssignmentsService,
    public loadingController: LoadingController,
    public streamingMedia: StreamingMedia, 
    private storage: Storage) {
    if (navParams.data.classId)
      this.selectedClass = navParams.data.classId
    else
      this.selectedClass = navParams.get('classObject')
  }

  ionViewWillEnter() {
    this.presentLoading()
    this.storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      // this.selectedStudent = this.navParams.get('student')
      console.log("LOCAL STORAGE FROM STUDENT ACTIVITY:---\n", this.loggedUser,
                  "\nCLASS FROM PARAMS:---\n", this.selectedClass)
      this._assignmentsService.allActivitiesByClassId(this.selectedClass.id)
      .subscribe(result => {
        console.log("RESULT FROM ALL ACTIVITIES:---", result.activities)
        this.allActivites = result.activities
        this.loader.dismissAll()
      })
        // this.loader.dismissAll()
    })
  }

  addActivity(){
    this.navCtrl.push(AddClassActivity, {'selectedClass': this.selectedClass})
  }

  playVideo(video){
    console.log("VIDEO TO PLAY:---\n", video.url)
    let videoSrc = this.myVideo.nativeElement;
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played'); },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'landscape'
    };
    videoSrc.src = video.url
    this.streamingMedia.playVideo(video.url, options);
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'loading…'
    });
    this.loader.present();
  }


}
