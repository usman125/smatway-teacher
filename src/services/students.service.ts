import { Injectable, Compiler  } from '@angular/core';
import {Http, Headers, RequestOptions } from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class StudentsService{
  constructor(private http: Http, 
              private _httpClient: HttpClient, 
              private _compiler: Compiler){
  }

  addStudent(student){
    let headers = new Headers({ 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept':'application/json, text/plain, */*'
    });
    let options = new RequestOptions({ headers: headers });
    let newSchool = {
      'schoolId': student.schoolId,
      'studentName': student.name,
      'studentPassportNo': student.passportno,
      'studentNationality': student.nationality,
      'studentAddress': student.address,
      'studentRegistrationDate': student.joindate,
      'studentSchoolIdentityNo': student.schoolregid,
      'studentDateOfBirth': student.dob,
      'studentAge': student.age,
      'parentName': student.pname,
      'parentPassportNo': student.ppassportno,
      'relationWithStudent': student.prelation,
      'parentPhone': student.pphone,
      'parentMobile': student.pmobile,
      'parentAddress': student.paddress,
      'studentImage': student.studentImage,
      'parentNationality': student.pnationality,
      'username': student.username,
      'password': student.password,
    }
    console.log("NEW STDUENT CALLED:---\n", newSchool);
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/create', newSchool)
        .map(res => res.json());
  }

  editStudent(student){
    let headers = new Headers({ 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Accept':'application/json, text/plain, */*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new HttpParams()
        .set('studentId', student.studentId)
        .set('studentName', student.name)
        .set('studentPassportNo', student.passportno)
        .set('studentNationality', student.nationality)
        .set('studentAddress', student.address)
        .set('studentRegistrationDate', student.joindate)
        .set('studentSchoolIdentityNo', student.schoolregid)
        .set('studentDateOfBirth', student.dob)
        .set('studentAge', student.age)
        .set('studentIsActive', student.studentIsActive)
        .set('parentId', student.parentId)
        .set('parentName', student.pname)
        .set('parentPassportNo', student.ppassportno)
        .set('relationWithStudent', student.prelation)
        .set('parentPhone', student.pphone)
        .set('parentMobile', student.pmobile)
        .set('parentAddress', student.paddress)
        .set('parentNationality', student.pnationality)
        .set('parentIsActive', student.parentIsActive);
    console.log("edit student service called\n", body);
    return this.http.post('https://mmschoolapp.azurewebsites.net/api/students/update', body.toString(), options)
        .map(res => res.json());
  }



  allStudents(){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/all')
          .map(res => res.json());
  }

  getStudentById(studentId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/'+studentId)
          .map(res => res.json());
  }


  allStudentsBySchool(schoolId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/all/'+schoolId)
          .map(res => res.json());
  }

  allSortStudentsByClassId(ClassId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/alphabetical/class/'+ClassId)
          .map(res => res.json());
  }

  allStudentsByClassId(ClassId){
      // console.log("USER ID FROM AUTH USER: ", userId);
      return this.http.get('https://mmschoolapp.azurewebsites.net/api/students/get/class/'+ClassId)
          .map(res => res.json());
  }



}

