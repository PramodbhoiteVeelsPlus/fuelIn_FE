import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  constructor(private router: Router, private layout: LayoutService, private layoutInit: LayoutInitService, 
    private post: StatsService,
    public cd: ChangeDetectorRef,private modalService: NgbModal,) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
      this.accessGroup = element.accessGroupId;
      this.getCorporateById(this.veelsplusCorporate)
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      }else if (element.accessGroupId == '2') {
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
      }else if (element.accessGroupId == '12' || element.accessGroupId == '14') {
        this.isDealer = true;
        this.isAdmin = false;
        this.isTransporter = false;
      }else{
        this.isAdmin = false;
        this.isDealer = false;
        this.isTransporter = false;
        this.router.navigate(['/auth/login']);
      }
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
          alert(res.msg)
         
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
  
  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
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
}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
