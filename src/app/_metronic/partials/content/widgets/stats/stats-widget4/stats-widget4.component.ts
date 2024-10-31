import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../stats.services';

@Component({
  selector: 'app-stats-widget4',
  templateUrl: './stats-widget4.component.html',
})
export class StatsWidget4Component implements OnInit {
  personName: string;
  updateAvailable: boolean = false;
  page: any = 1;
  pageSize: any = 10;
  mobileForm = new FormGroup({
    newNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    oldNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    mobileNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
  });
  personName1: string;
  personName2: string;
  companyName2: any;
  role: string;
  updateMobileLog: any = [];
  createdBy: string;
  entityGroup: string;

  checkNewMobileNoLength: any;
  checkOldMobileNoLength: any;
  isCorrectOldMobileNumber: boolean = false
  isCorrectNewMobileNumber: boolean = false
  showNewMobileNumberField: boolean = false;
  updateMobileLog1: any = []
  showDetails: boolean = false
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  searchBox: FormControl = new FormControl();
  searchTerm: any = "";

  get userMobile1() {
    return this.mobileForm.get('newNumber')
  }
  get userMobile() {
    return this.mobileForm.get('oldNumber')
  }
  get userMobile2() {
    return this.mobileForm.get('mobileNumber')
  }

  companyName: string;


  constructor(private post: StatsService,
    private spinner: NgxSpinnerService, private cd: ChangeDetectorRef,) {

  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.createdBy = element.firstName + ' ' + element.lastName
    this.getDetailsByUpdateMobileLog()
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDetailsByNewMobileNumber();
  }

  getDetailsByNewMobileNumber() {
    this.mobileForm.controls["mobileNumber"].setValue("")
    this.checkNewMobileNoLength = this.mobileForm.value.newNumber
    if (this.checkNewMobileNoLength.toString().length == 10) {
      if (this.mobileForm.value.newNumber) {
        let data = {
          newPhoneNumber: this.mobileForm.value.newNumber,
        }
        this.post.getDetailsByMobilePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                alert("This mobile Number is already in Our DataBase..")
                this.personName1 = res.data[0].firstName + ' ' + res.data[0].lastName
                this.updateAvailable = false;
                this.isCorrectNewMobileNumber = false
              } else {
                this.updateAvailable = true;
                this.isCorrectNewMobileNumber = true
              }
            }
            else {
            }
          })
      }
    } else {
      alert("Please enter 10 digit mobile number.")
      this.isCorrectNewMobileNumber = false
    }
  }

  getDetailsByOldMobileNumber() {
    this.mobileForm.controls["mobileNumber"].setValue("")
    this.checkOldMobileNoLength = this.mobileForm.value.oldNumber
    if (this.checkOldMobileNoLength.toString().length == 10) {
      if (this.mobileForm.value.oldNumber) {
        let data = {
          oldPhoneNumber: this.mobileForm.value.oldNumber,
          newPhoneNumber: "1111111111",
        }
        this.post.getDetailsByMobilePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.personName = res.data[0].firstName + ' ' + res.data[0].lastName
                this.companyName = res.data[0].companyName
                this.entityGroup = res.data[0].entityGroup;
                this.isCorrectOldMobileNumber = true
                this.showNewMobileNumberField = true;
                this.showDetails = true;
              } else {
                alert("This mobile Number is not in Our DataBase as Dealer or Transporter..")
                this.isCorrectOldMobileNumber = false
              }
            }
            else {
            }
          })
      } else {
      }
    } else {
      alert("Please enter 10 digit mobile number.")
      this.isCorrectOldMobileNumber = false
    }
  }

  updateMobileNumber() {
    this.mobileForm.controls["mobileNumber"].setValue("")
    if (this.mobileForm.value.oldNumber && this.mobileForm.value.newNumber) {
      this.spinner.show()
      let data = {
        oldPhoneNumber: this.mobileForm.value.oldNumber,
        newPhoneNumber: this.mobileForm.value.newNumber,
        updateBy: this.createdBy,
        companyName: this.companyName,
        hostName: this.personName,
      }
      this.post.updatePersonMobilePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.spinner.hide()
            alert("Mobile Number updated..")
            this.mobileForm.reset();
            this.updateAvailable = false;
            this.isCorrectNewMobileNumber = false;
            this.isCorrectOldMobileNumber = false;
            this.showNewMobileNumberField = false;
            this.personName = ''
            this.personName1 = ''
            this.companyName = ''
            this.entityGroup = ''
            this.getDetailsByUpdateMobileLog()
          } else {
            this.spinner.hide()
            alert("Error to Update Mobile Number..")
          }
        })
    } else {
      alert("Enter both number..")
    }
  }

  //getDetailsByMobileNumber
  getDetailsByMobileNumber() {
    if (this.mobileForm.value.mobileNumber) {
      this.personName2 = ''
      this.companyName2 = ''
      this.role = ''
      let data = {
        mobileNumber: this.mobileForm.value.mobileNumber,
      }
      this.post.getDetailsByMobilePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.personName2 = res.data[0].firstName + ' ' + res.data[0].lastName
              this.companyName2 = res.data[0].companyName
              if (res.data[0].accessGroupId == 2) {
                this.role = 'TRANSPORTER'
              } else {
                if (res.data[0].accessGroupId == 12) {
                  this.role = 'DEALER'
                } else {
                  if (res.data[0].accessGroupId == 13) {
                    this.role = 'DEALER-OPERATOR'
                  } else {
                    if (res.data[0].accessGroupId == 14) {
                      this.role = 'DEALER-MANAGER'
                    } else {
                      if (res.data[0].accessGroupId == 16) {
                        this.role = 'TRANSPORTER-MANAGER'
                      } else {
                        if (res.data[0].accessGroupId == 7) {
                          this.role = 'ADMIN'
                        } else {
                          this.role = 'OTHER'
                        }
                      }
                    }
                  }
                }
              }
            } else {
            }
          }
          else {
          }
        })
    } else {
    }
  }

  //getDetailsByUpdateMobileLogPOST
  getDetailsByUpdateMobileLog() {
    let data = {}
    this.post.getDetailsByUpdateMobileLogPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.updateMobileLog = res.data
            this.updateMobileLog1 = res.data
            this.cd.detectChanges();
          } else {
          }
        }
        else {
        }
      })
  }

  //  Free Search
  search() {
    let term = this.searchTerm;
    this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
      return res.updateMobileLogCompanyName.indexOf(term) >= 0;
    });
    if (this.updateMobileLog.length == 0) {
      term = this.searchTerm;
      this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
        return res.updateMobileLogCompanyName.indexOf(term) >= 0;
      });
    }
    if (this.updateMobileLog.length == 0) {
      term = this.searchTerm;
      this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
        return res.updateMobileLogHostName.indexOf(term) >= 0;
      });
    }
    if (this.updateMobileLog.length == 0) {
      term = this.searchTerm;
      this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
        return res.updateMobileLogOldNumber.indexOf(term) >= 0;
      });
    }
    if (this.updateMobileLog.length == 0) {
      term = this.searchTerm;
      this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
        return res.updateMobileLogNewNumber.indexOf(term) >= 0;
      });
    }
    if (this.updateMobileLog.length == 0) {
      term = this.searchTerm;
      this.updateMobileLog = this.updateMobileLog1.filter(function (res: any) {
        return res.updateMobileLogBy.indexOf(term) >= 0;
      });
    }
  }

}

