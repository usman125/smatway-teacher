import { Injectable, Compiler  } from '@angular/core';
import {Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClassesService{
  constructor(private http: Http, 
              // private _router: Router, 
              private _httpClient: HttpClient, 
              private _compiler: Compiler){
  }

  addClass(obj){
    let headers = new Headers({ 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept':'application/json, text/plain, */*'
    });
    let body = new HttpParams()
        .set('schoolId', obj.schoolId)
        .set('teacherId', obj.teacher)
        .set('subjectId', obj.subject)
        .set('name', obj.name)
        .set('section', obj.section)
        // .set('studentIds', obj.students);
    obj.students.forEach(id => {
      body = body.append('studentIds[]', id);
    });
    let options = new RequestOptions({ headers: headers });
    console.log("Login service called", body.toString());
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/create', body.toString(), options)
        .map(res => res.json());
  }

  editClass(obj){
    let headers = new Headers({ 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept':'application/json, text/plain, */*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new HttpParams()
        .set('classId', obj.classId)
        .set('teacherId', obj.teacher)
        .set('subjectId', obj.subject)
        .set('name', obj.name)
        .set('section', obj.section)
        .set('isActive', obj.isActive);
    obj.students.forEach(id => {
      body = body.append('studentIds[]', id);
    });
    console.log("edit class service called\n", body);
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/update', body.toString(), options)
        .map(res => res.json());
  }


  allClassesBySchool(schoolId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/school/'+schoolId)
          .map(res => res.json());
  }

  
  allClassesByTeacherId(teacherId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/teacher/'+teacherId)
          .map(res => res.json());
  }

  allClassesCountBySchool(schoolId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/count/school/'+schoolId)
          .map(res => res.json());
  }

  getClassById(classId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/get/'+classId)
          .map(res => res.json());
  }






}

