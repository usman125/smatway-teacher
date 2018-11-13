import {Injectable} from "@angular/core";
import {Http} from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LoginService {
  private activities: any;

  constructor(private _http: Http) {
  }

  checkLogin(username, password){
    return this._http.post('https://mmschoolapp.azurewebsites.net/api/users/login', 
                            {"username": username, "password": password})
          .map(res => res.json());
  }
}
