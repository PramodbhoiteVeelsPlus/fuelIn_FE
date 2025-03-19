import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading$: Observable<boolean>;
  ismobileScreen: boolean = false;
  phone: any = "";

  personId: any;
  error: string;
  success: string;
  errormobile: boolean = false;
  errormsg: string;
  isOTP: boolean = false;
  isCompareOTP: boolean = false;
  otpNumber: any;
  password: any;
  _show = false
  _pwdType = 'password'
  _show1 = false
  _pwdType1 = 'password'
repeatPassword: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private post: AuthService,
    private router: Router,
    public cd: ChangeDetectorRef,) {
    // this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {

  }

  findPhoneNumber() {
    if (this.phone.toString().length == 10) {

      if (this.phone) {
        let data = {
          phone: this.phone
        }
        this.post.findPhone(data)
          .subscribe(res => {
            if (res.status == "OK") {
              this.personId = res.data[0].personId
              this.sendOTP();
              //  alert(res.msg);

            } else {

              //  alert('Mobile Number Not Found');
              this.error = ''
              this.success = '';
              this.phone = ""
              this.errormobile = false
              this.error = 'Mobile Number Not Found';

            }
          })
      } else {
        //  alert('Please Enter Mobile Number')
        this.error = ''
        this.success = '';
        this.errormobile = false
        this.error = 'Please Enter Mobile Number';

      }
    }
    else {
      // this.error = ''
      // this.success = '';
      this.errormobile = true
      this.phone = ''
      this.errormsg = 'Please enter 10 digit Mobile number';
    }
    // this.errormobile = false 

    this.success = '';
    this.error = '';

  }

  sendOTP() {
    let data = {
      numbers: this.phone,
    }
    this.post.sendOTPsmsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          // alert(res.msg)
          // this.error = res.msg ? res.msg : '';
          this.error = ''
          this.success = '';
          this.success = res.msg ? res.msg : '';

          this.isOTP = false;
          this.isCompareOTP = true;
          this.ismobileScreen = true;
          this.cd.detectChanges()
        } else {
          // alert(res.msg)
          this.error = ''
          this.success = '';
          this.error = res.msg ? res.msg : '';
          this.cd.detectChanges()

          //  this.isOTP = true;
        }
      })

    this.success = '';
    this.error = '';
  }

  compareOTP() {
    let data = {
      numbers: this.phone,
      otp: this.otpNumber
    }
    this.post.compareOTPPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          //  alert(res.msg)
          this.isOTP = true;
          this.isCompareOTP = false;
          // this.successmsg = true;
          this.cd.detectChanges()

        } else {
          this.isOTP = false;
          //  alert(res.msg)
          this.error = ''
          this.success = '';
          this.error = res.msg ? res.msg : '';
          this.otpNumber = "";
          this.cd.detectChanges()
        }
      })
    this.success = '';
    this.error = '';
    this.error = '';
    this.success = '';
  }

  toggleShow() {
    this._show = !this._show
    this._pwdType = this._show ? 'text' : 'password'
  }
  
toggleShow3() {
  this._show1 = !this._show1
  this._pwdType1 = this._show1 ? 'text' : 'password'
}


updatePassword(){

  if(this.password){
    if ( this.password == this.repeatPassword) {
    
      let data = {
       password:this.password,
       personId:this.personId
     }
     this.post.updatepasswordPOST(data)
     .subscribe(res=>{
       if(res.status=="OK"){
          // alert(res.msg)

          this.error = ''
           this.success = '';
          this.success = res.msg ? res.msg : '';
          // this.isOTP = true;
          // this.isCompareOTP = true;
          this.cd.detectChanges()
             this.router.navigate(['/auth/login']);

       }else{
        alert(res.msg)
      //   this.errormsg = true
      // this.successmsg = false;
        this.error = res.msg ? res.msg : '';
        //  this.isOTP = true;
          this.cd.detectChanges()
       } 
     })

      } else {
        this.password = "";
        this.repeatPassword = "";
        // alert("Password And Repeat Password Not Match!")
        // this.errormsg = true
        //  this.successmsg = false;
        this.error = 'Password And Repeat Password Not Match!';

        this._show1 = false
         this._show = false
         this._pwdType = 'password'
         this._pwdType1 = 'password'

      }
  }
  else{
    // alert("Please Enter Valid Password!")
    // this.successmsg = false;
    // this.errormsg = true;
    this.error = 'Please Enter Valid Password!'
  }
  
  // this.successmsg = false;
  // this.errormsg = false;
}
}
