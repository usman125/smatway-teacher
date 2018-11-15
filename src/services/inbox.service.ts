import {Injectable} from "@angular/core";
import {Http} from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class InboxService {
  private activities: any;

  constructor(private _http: Http) {
  }

  allChatsByUserId(userId){
    return this._http.get('https://mmschoolapp.azurewebsites.net/api/messages/conversations/get/'+userId)
          .map(res => res.json());
  }

  parentByUserId(userId){
    return this._http.get('https://mmschoolapp.azurewebsites.net/api/students/parent/get/by/'+userId)
          .map(res => res.json());
  }

  teacherByUserId(userId){
    return this._http.get('https://mmschoolapp.azurewebsites.net/api/teachers/get/by/'+userId)
          .map(res => res.json());
  }




  addNewChat(chat){
    return this._http.post('https://mmschoolapp.azurewebsites.net/api/messages/send', {'senderId':chat.senderId,
                                                                                       'receiverId':chat.receiverId,
                                                                                       'message':chat.message,})
          .map(res => res.json());
  }


}
