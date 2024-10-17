import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-custlogin',
  templateUrl: './custlogin.component.html',
  styleUrls: ['./custlogin.component.scss']
})
export class CustloginComponent {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  isvalidPhone: boolean = false;
  // set the currenr year
  year: number = new Date().getFullYear();
  username: string;


  _show = false
  _pwdType = 'password'
  fuelDealerSQLId: any;
  allData: any = [];
  modalRefCancel: any;
  closeResult: string;
  userData: any = [];
  authenticationToken: any;
  element: any = [];
  modalRefer: any;
  referForm = new FormGroup({
    dealerName: new FormControl(''),
    petrolPump: new FormControl(''),
    dealerMobile: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    dealerCity: new FormControl(''),
    dealerState: new FormControl('', [Validators.required]),
  });
  get userMobile() {
    return this.referForm.get('dealerMobile')
  }
  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private post: AuthService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    console.log("Login Page")
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit(openModal: any, refer: any) {
    this.submitted = true;

    // stop here if form is invalid

    let data = {
      "veelsPlusUser": this.f.phone.value,
      "password": this.f.password.value
    }
    this.post.login(data)
      .subscribe(res => {
        if (res.status == "OK") {


          if (res.element.length > 1) {
            this.allData = res.allData;
            this.userData = res.data
            this.element = res.element;
            this.authenticationToken = res.authenticationToken

            this.modalRefCancel = this.modalService.open(openModal)
            this.modalRefCancel.result.then((result: any) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          } else {
            localStorage.setItem('isLoggedin', 'true');
            localStorage.setItem('username', this.username);
            localStorage.setItem('userdata', JSON.stringify(res.data));
            localStorage.setItem('element', JSON.stringify(res.element));
            localStorage.setItem('authenticationToken', JSON.stringify(res.authenticationToken));

            if (res.element.accessGroupId == 12 || res.element.accessGroupId == 14 || res.element.accessGroupId == 19 || res.element.accessGroupId == 21 || res.element.accessGroupId == 17 || res.element.accessGroupId == 18) {
              var element = JSON.parse(localStorage.getItem("element") || '{}');
              if (res.element.accessGroupId == 12) {
                this.getDealerIdByPhone(element.phone1);
              }
              // this.post.checkUrlForRefresh('login')
              // this.getDealerIdByPhone(element.phone1);
              this.modalRefer = this.modalService.open(refer)
              this.modalRefer.result.then((result: any) => {
                this.closeResult = `Closed with: ${result}`;
              }, (reason: any) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
              });
            } else {
              var element = JSON.parse(localStorage.getItem("element") || '{}');
              if (res.element.accessGroupId == 7 || res.element.accessGroupId == 2 || res.element.accessGroupId == 16) {
                this.router.navigate(['/dashboard']);
              } else {
                alert("Oops..! Getting some Error.. Please Re-Login..")
                // this.post.checkUrlForRefresh('login')
              }
            }

          }
        }
        else {
          alert(res.msg)
          this.loginForm.reset();
          this.error = res.msg ? res.msg : '';
        }
      })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selectBusiness(i: string | number, refer: any) {
    this.modalRefCancel.close('close')
    console.log("i", i)
    localStorage.setItem('isLoggedin', 'true');
    localStorage.setItem('element', JSON.stringify(this.element[i]));
    localStorage.setItem('username', this.username);
    localStorage.setItem('userdata', JSON.stringify(this.userData));
    localStorage.setItem('authenticationToken', JSON.stringify(this.authenticationToken));

    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.getDealerIdByPhone(element.phone1);
    this.modalRefer = this.modalService.open(refer)
    this.modalRefer.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.router.navigate(['/dashboard']);
  }



  toggleShow() {
    this._show = !this._show
    this._pwdType = this._show ? 'text' : 'password'
  }


  getDealerIdByPhone(phoneNumber: any) {
    const data = {
      mobileNumber: phoneNumber,
    };
    this.post.searchDealerByMobile(data).subscribe((res) => {
      if ((res.status = "OK")) {
        this.fuelDealerSQLId = res.data[0].fuelDealerId;
      } else {
      }
    });
  }


  // For Refferal
  checkPhone() {
    let data = {
      phone: this.referForm.value.dealerMobile
    }
    this.post.findPhone(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)

        }
      })
  }

  submitRefferal() {
    this.spinner.show()
    let data = {
      dealerId: this.fuelDealerSQLId,
      companyName: this.referForm.value.petrolPump,
      ownerName: this.referForm.value.dealerName,
      mobileNumber: this.referForm.value.dealerMobile,
      city: this.referForm.value.dealerCity,
      state: this.referForm.value.dealerState,
      referralEntryFrom: 'PORTAL'
    }

    this.post.addReferralPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.closeRefModal()
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.spinner.hide()
      }
    })
  }

  closeRefModal() {
    this.referForm.reset();
    this.modalRefer.close('close')
    this.router.navigate(['/dashboard']);
  }

}
