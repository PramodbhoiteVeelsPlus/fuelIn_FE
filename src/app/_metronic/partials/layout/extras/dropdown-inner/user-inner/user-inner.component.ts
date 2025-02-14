import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { Router } from '@angular/router';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})

export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  langs = languages;
  user: boolean = true;
  private unsubscribe: Subscription[] = [];
  veelsplusCorporate: any;
  customerId: any;
  isAdmin: boolean = false;
  emailVerification: boolean = false;
  email: any;
  isUserEmail: boolean = false;
  isUpdateMail: boolean = false;
  modalVerifyEmail: any;
  closeResult: string;
  isOTP: boolean = false;

  emailForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
  ]),
  });
  personId: any;
  mobileNumber: any;
  isView: boolean = false;
  emailOTP: any;
  
  constructor(
    private auth: AuthService,
    private post: StatsService,
    private translationService: TranslationService, 
    private router: Router,
    private modalService: NgbModal, 
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    // this.user$ = this.auth.currentUserSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsplusCorporate = element.veelsPlusCorporateID;
    this.personId = element.personId;
    this.mobileNumber = element.phone1;
    if (element.accessGroupId == '12') {
      this.isAdmin = true;
    }
    this.getCorporateById(this.veelsplusCorporate)
    if (element.email1) {
      if (element.emailVerification == 'TRUE') {
        this.isUserEmail = true;
        this.email = element.email1;
        this.emailVerification = true;
      } else {
        this.getPersonByPhone(element.phone1)
      }
    } else {
      this.isUserEmail = false;
      this.emailVerification = false;
      this.isUpdateMail = true;
      this.getPersonByPhone(element.phone1)
    }
  }

  logout() {
    localStorage.setItem('isLoggedin', 'false');
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  getCorporateById(veelsplusCorporate: any) {
    let data = {
      veelsplusCorporateId: veelsplusCorporate,
    };

    this.post.getBranchVeelsplusId(data).subscribe((res) => {
      if (res.status == "OK") {
        this.customerId = res.data[0].customerId;
      } else {
        alert("Seesion TimeOut Please Login Again..!")
        this.router.navigate(['/auth/login'])
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  
  getPersonByPhone(phone1: any){
    let data = {
        phone1:phone1
    }
    this.post.getPersonByPhonePOST(data).subscribe((res)=>{
        if(res.data.length && res.status == "OK"){ 
          if(res.data[0].email1 && res.data[0].email1 != "undefined"){
            this.isUpdateMail = false;   
            this.email = res.data[0].email1;            
          }else{
            this.isUpdateMail = true;   
          }             
            if(res.data[0].emailVerification == 'TRUE'){
                this.emailVerification = true;
            }else{ 
                this.emailVerification = false;
            }
        }else{ 
          this.emailVerification = false;
      }
    })
}

openVerifyEmail(verifyEmail: any) {  
  this.modalVerifyEmail = this.modalService.open(verifyEmail);
  this.modalVerifyEmail.result.then(
      (result: any) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
          this.closeResult = `Dismissed`;
      }
  );
}

editEmail(){
  this.isUpdateMail = !this.isUpdateMail;
  this.isOTP = false;
}

updateEmailById(){
  if(this.emailForm.value.email){
  //personId,mail
  this.spinner.show();
  let data = {
    personId:this.personId,
    email: this.emailForm.value.email,  
  }   
  this.post.updatePerson(data)
    .subscribe(res => {
      if (res.status = "OK") {
        alert("Email updated successfully..!");
        this.emailForm.controls["email"].setValue("");
        this.email = "",
        this.isUpdateMail = false;
        this.spinner.hide()
        this.getPersonByPhone(this.mobileNumber)
      } else {
        alert(res.msg);
        this.spinner.hide()
      }
    })
  }else{
    alert("Please Enter Valid Email..!")
  }
 
}

verifyEmailById(){
  //sent Mail for OTP 
  this.spinner.show()
      let data = { 
        email: this.email,  
      }   
      this.post.sendOTPEmailPOST(data)
        .subscribe(res => {
          if (res) {
            alert("OTP send on Email successfully.. Please check Email "+this.email+" and Enter OTP..!");
            this.isOTP = true
            this.spinner.hide()
          } else {
            alert(res.msg);
            this.spinner.hide()
          }
        })
  
}

viewOTP(){
  this.isView = !this.isView
}

submitOTP(){
  this.spinner.show()
  //Email,OTP
  let data = { 
    email: this.email,  
    emailOTP: this.emailOTP,
    personId: this.personId,
  }   
  this.post.checkOTPEmailPOST(data)
    .subscribe(res => {
      if (res.status = "OK") {
        alert(res.msg);
        this.getPersonByPhone(this.mobileNumber);   
        this.modalVerifyEmail.close('close');
        this.spinner.hide()
      } else {
        alert(res.msg);
        this.spinner.hide()
      }
    })
}
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
