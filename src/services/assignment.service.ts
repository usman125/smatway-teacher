import { Injectable, Compiler  } from '@angular/core';
import {Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AssignmentsService{

  constructor(private http: Http, 
              // private _router: Router, 
              private _httpClient: HttpClient, 
              private _compiler: Compiler){
  }

  addAssignment(assignment){
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/assignments/create', 
                            {'teacherId': assignment.teacherId, 
                             'classId': assignment.classId,
                             'title': assignment.title,
                             'submissionDate': assignment.submissionDate})
      .map(res => res.json());
  }

  addStudentAssignment(assignment){
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/assignments/create/student', 
                            {'teacherId': assignment.teacherId, 
                             'studentId': assignment.studentId,
                             'title': assignment.title,
                             'submissionDate': assignment.submissionDate})
      .map(res => res.json());
  }



  markAssignment(assignment){
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/assignments/mark', 
                            {'assignmentId': assignment.assignmentId, 
                             'students': assignment.students,})
      .map(res => res.json());
  }


  getAssignmentById(assignmentId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/assignments/get/'+assignmentId)
      .map(res => res.json());
  }

  allAssignmentsByClassId(classId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/assignments/get/class/'+classId)
      .map(res => res.json());
  }

  allAssignmentsByStudentId(studentId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/assignments/get/student/'+studentId)
      .map(res => res.json());
  }



  allActivitiesByStudentId(studentId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/activities/get/student/'+studentId)
      .map(res => res.json());    
  }

  allActivitiesByClassId(classId){
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/activities/get/class/'+classId)
      .map(res => res.json());    
  }



  markOverallPerformance(performance){   
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/overall/evaluation/create', 
                            {'studentId': performance.studentId, 
                             'response': performance.response,
                             'writing': performance.writing,
                             'listening': performance.listening,
                             'speaking': performance.speaking,
                             'reading': performance.reading})
      .map(res => res.json());
  }

  getOverallPerformance(studentId){   
    return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/overall/evaluation/get/'+studentId)
      .map(res => res.json());
  }



}

