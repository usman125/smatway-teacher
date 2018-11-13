import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PlannerService{

  constructor(private http: Http){
  }

  allPlannerBySchoolId(schoolId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/planners/get/school/'+schoolId)
          .map(res => res.json());
  }



}

