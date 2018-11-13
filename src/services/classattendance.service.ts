import { Injectable, Compiler  } from '@angular/core';
import {Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClassAttendanceService{

  constructor(private http: Http, 
              // private _router: Router, 
              private _httpClient: HttpClient, 
              private _compiler: Compiler){
  }

  addAttendance(attendance){
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/classes/attendance/mark/', 
                            {'classId': attendance.classId, 
                             'date': attendance.date,
                             'students': attendance.students})
      .map(res => res.json());
  }


  getTodayClassAttendance(date, classId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/attendance/getbydate/?date='+date+'&classId='+classId)
      .map(res => res.json());
  }
  
  addTeacherAttendance(attendance){
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/mark/', 
                            {'teacherId': attendance.teacherId, 
                             'date': attendance.date,
                             'isPresent': attendance.isPresent})
      .map(res => res.json());
  }


  getTodayTeacherAttendance(date, teacherId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/getbydate/?date='+date+'&teacherId='+teacherId)
      .map(res => res.json());
  }

  getTeacherMonthAttendance(teacherId, month, year){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/teachers/attendance/get/teacher/'+teacherId+'/month/'+month+'/year/'+year)
      .map(res => res.json());
  }

  getStudentMonthAttendance(studentId, month, year){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/classes/attendance/get/student/'+studentId+'/month/'+month+'/year/'+year)
      .map(res => res.json());
  }




}

