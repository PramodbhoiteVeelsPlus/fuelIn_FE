import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {

  referForm = new FormGroup({
    dealerName:new FormControl(''),
    petrolPump:new FormControl(''),
    dealerMobile:new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    dealerCity:new FormControl(''),
    dealerState: new FormControl('', [Validators.required]),   
  });
  
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = false;
  veelsplusCorporate: any;
  customerId: any;
  phone1: any;
  companyName: any;
  city: any;
  accessGroup: any;
  modalRefCancel: any;
  closeResult: string;
  fuelDealerId: any;
  primeDealerStatus: any;
  personId: any;
  firstName: any;
  lastName: any;
  mobileNumber: any;
  email: any;
  state: any;
  brandName: any;
  isUpdateLite: boolean = false;
  fuelDealerConversionId: any;
  userName: string;

  constructor(private router: Router, private layout: LayoutService, private layoutInit: LayoutInitService, 
    private post: StatsService,
    public cd: ChangeDetectorRef,private modalService: NgbModal,) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
      this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
      this.accessGroup = element.accessGroupId;
      this.primeDealerStatus = element.primeDealerStatus;
      this.personId = element.personId;
      this.firstName  = element.firstName
      this.lastName = element.lastName
      this.mobileNumber = element.phone1;
      this.email = element.email1;
      this.state = element.state;
      this.brandName = element.brandName;
      this.userName = element.firstName +' '+ element.lastName;
      this.city = dealerData.city;
      this.companyName = dealerData.companyName;
      this.phone1 = dealerData.hostPhone;
      // this.getCorporateById(this.veelsplusCorporate)
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      }else if (element.accessGroupId == '2') {
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
      }else if (element.accessGroupId == '12' || element.accessGroupId == '14' || element.accessGroupId == '19') {
        this.isDealer = true;
        this.isAdmin = false;
        this.isTransporter = false;
      }else{
        this.isAdmin = false;
        this.isDealer = false;
        this.isTransporter = false;
        this.router.navigate(['/auth/login']);
      }
      this.getReqInfoByPersonId()
      this.cd.detectChanges();
    } else {
      this.router.navigate(['/auth/login'])
      this.cd.detectChanges();
    }
  }


  openRefferalModal(refer: any) {
    this.modalRefCancel = this.modalService.open(refer)
    this.modalRefCancel.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
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
  
  checkPhone() {
    let data = {
      phone: this.referForm.value.dealerMobile
    }
    this.post.findPhoneNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if(this.mobileNumber == this.referForm.value.dealerMobile){
            alert("Can't Enter Your Own Number...")
            this.referForm.controls["dealerMobile"].setValue("")
          } 
          // alert(res.msg)
         
        }
      })
  }

  submitRefferal() {
    let data = {
      dealerId: this.fuelDealerId,
      companyName: this.referForm.value.petrolPump,
      ownerName: this.referForm.value.dealerName,
      mobileNumber: this.referForm.value.dealerMobile,
      city: this.referForm.value.dealerCity,
      state: this.referForm.value.dealerState,
      referralEntryFrom: 'PORTAL'
    }

    console.log("data", data)
    this.post.addReferralPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.closeRefModal()
      } else {
        alert(res.msg)
      }
    })
  }

  closeRefModal(){
    this.referForm.reset();
    this.modalRefCancel.close('close')
  }

  setBaseLayoutType(layoutType: LayoutType) {
    this.layoutInit.setBaseLayoutType(layoutType);
  }

  setToolbar(toolbarLayout: 'classic' | 'accounting' | 'extended' | 'reports' | 'saas') {
    const currentConfig = {...this.layout.layoutConfigSubject.value};
    if (currentConfig && currentConfig.app && currentConfig.app.toolbar) {
      currentConfig.app.toolbar.layout = toolbarLayout;
      this.layout.saveBaseConfig(currentConfig)
    }
  }
  
  getCorporateById(veelsplusCorporate: any) {
    let data = {
        veelsplusCorporateId: veelsplusCorporate,
    };

    this.post.getBranchVeelsplusId(data).subscribe((res) => {
        if (res.status == "OK") {
            this.customerId = res.data[0].customerId;
            this.getCustomerAllDataById(this.customerId)
        } else {
          alert("Seesion TimeOut Please Login Again..!")
          this.router.navigate(['/auth/login'])
        }
    });
  }
  
  getCustomerAllDataById(customerId: any) {
    let data = {
      customerId: customerId
    }

    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.city = res.data[0].city;
          this.companyName = res.data[0].companyName;
          this.phone1 = res.data[0].phone1;

          // this.getBranchByCorporateVeelsplusId(this.vpcorporateId);
          this.cd.detectChanges();
        }
      })
  }

  cofirmToUpdate(cancelReq: any) {
    this.modalRefCancel = this.modalService.open(cancelReq)
    this.modalRefCancel.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
  }

  requestForLiteToPrime(){
    let data = {
      fuelDealerConversionPreAccessGroupId: this.accessGroup,
      fuelDealerConversionCurrentAccessGroupId: this.accessGroup,
      fuelDealerConversionStatus:"PROGRESS",
      fuelDealerConversionPersonId:this.personId,
      fuelDealerConversionCreatedBy:this.personId,
      convertedAt: moment(new Date()).format('YYYY-MM-DD'),
      convertedByPersonId: this.personId,
      fuelDealerConversionCreatedAt:moment(new Date()).format('YYYY-MM-DD'),
      userName:this.firstName +' '+this.lastName,
      companyName:this.companyName,
      mobileNumber:this.mobileNumber,
      city: this.city,
      email:this.email,
      state: this.state,
      fuelDealerId: this.fuelDealerId,
      fuelDealerConversionId: this.fuelDealerConversionId,
      oilCompany: this.brandName,
    }
    // console.log(data)
    this.post.requestForLiteToPrimePOST(data)
    .subscribe(res=>{
      alert(res.msg)
      this.modalRefCancel.close('close')
      
      // this.logout();

    })
  }
  
  getReqInfoByPersonId(){
    let data = {
      fuelDealerConversionPersonId:this.personId
    }
    this.post.getReqInfoByPersonIdPOST(data)
    .subscribe(res=>{
      if(res.data.length){
        this.fuelDealerConversionId = res.data[0].fuelDealerConversionId
        if(res.data[0].fuelDealerConversionStatus == "PROGRESS" || res.data[0].fuelDealerConversionStatus == "ACCEPT"){
          this.isUpdateLite = true;

        }else{
          this.isUpdateLite = false;
        }
      }
    })
  }
}

