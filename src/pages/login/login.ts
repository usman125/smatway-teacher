import {Component} from "@angular/core";
import {NavController, Events, AlertController, ToastController, MenuController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";
import {LocalWeatherPage} from "../local-weather/local-weather";
import {SelectClass} from "../selectclass/selectclass";
import {LoginService} from '../../services/login.service'
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})

export class LoginPage {

  loginForm: FormGroup;
  loggedUser: any = null


  constructor(public nav: NavController, 
              public forgotCtrl: AlertController, 
              public menu: MenuController, 
              public Events: Events, 
              public _formBuilder: FormBuilder, 
              public _loginService: LoginService, 
              public _storage: Storage, 
              public toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
    this._buildLoginForm()
    // this._storage.remove('user')
  }

  _buildLoginForm(){
    this.loginForm = this._formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    this.nav.setRoot(HomePage);
  }

  checkLogin(values){
    this._loginService.checkLogin(values.username, values.password)
    .subscribe(result => {
      // console.log("VALUES FROM LOGIN:---\n", values)
      if (result.status){
        this.loggedUser = result.user
        if (this.loggedUser.roleId === parseInt('3')){
          this.loggedUser.role = 'teacher'
          this.loggedUser.schoolId = this.loggedUser.teacher.schoolId
          this._storage.set('user', JSON.stringify(this.loggedUser))
          console.log("RESULT FROM LOGIN:---\n", this.loggedUser, 
                      this._storage.get('user').then((val) => {
                        console.log('Your STOREAGE ITEM IS:---\n', JSON.parse(val));
                      }))
          this.nav.setRoot(SelectClass)
          this.Events.publish('user:created', this.loggedUser, Date.now());
          const toast = this.toastCtrl.create({
            message: 'Your were successfully Logged In',
            // showCloseButton: true,
            // closeButtonText: 'Ok',
            duration: 3000
          });
          toast.present();
        }else{
          const toast = this.toastCtrl.create({
            message: 'Username or Password Incorrect..',
            // showCloseButton: true,
            // closeButtonText: 'Ok',
            duration: 3000
          });
          toast.present();
        }
      }else{
        const toast = this.toastCtrl.create({
          message: `${result.message}`,
          duration: 3000
          // showCloseButton: true,
          // closeButtonText: 'Ok'
        });
        toast.present();
      }
    })
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Forgot Password?',
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            console.log('Send clicked');
            let toast = this.toastCtrl.create({
              message: 'Email was sended successfully',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

}
