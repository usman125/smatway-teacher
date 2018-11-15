import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import {InboxService} from '../../services/inbox.service';


@Component({
  selector: 'single-chat',
  templateUrl: 'singlechat.html',
  providers: [InboxService]
})
export class SingleChat {

  selectedChat: any;
  loggedUser: any = null
  loader: any = null


  constructor(
    public _navCtrl: NavController,
    public _navParams: NavParams,
    public _inboxService: InboxService,
    public _loadingCtrl: LoadingController,
    private _storage: Storage) {
  }

  ionViewWillEnter() {
    let presentCount = 0
    let absentCount = 0
    this._storage.get('user').then(val => {
      this.loggedUser = JSON.parse(val)
      this.selectedChat = this._navParams.get('chat')
      console.log("SELCTED CHAT IS:--\n", this.selectedChat)
      for (let obj of this.selectedChat.messages){
        obj.date = moment(obj.dateCreated).fromNow()
      }
    })
  }


  getMonth(){
    let month = moment().format('M')
    return month;
  }
  
  getYear(){
    let year = moment().format('YYYY')
    return year;
  }


  getDate(){

    let day = new Date().getDate()
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    let fullDate = null
    if (month+1 < 10){
      fullDate = year+'-0'+(month+1)+'-'+day
    }else{
      fullDate = year+'-'+(month+1)+'-'+day
    }
    let created_at = moment(fullDate, 'YYYY-MM-DD').utcOffset(0, true).format();
    created_at = created_at.replace('Z', '')
    return created_at
  }

  presentLoading() {
    this.loader = this._loadingCtrl.create({
      content: 'Uploading…'
    });
    this.loader.present();
  }

}
