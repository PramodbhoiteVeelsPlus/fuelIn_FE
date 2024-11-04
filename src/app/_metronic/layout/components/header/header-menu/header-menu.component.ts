import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutType } from '../../../core/configs/config';
import { LayoutInitService } from '../../../core/layout-init.service';
import { LayoutService } from '../../../core/layout.service';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = false;
  veelsplusCorporate: any;
  customerId: any;
  phone1: any;
  companyName: any;
  city: any;
  cd: any;
  constructor(private router: Router, private layout: LayoutService, private layoutInit: LayoutInitService, 
    private post: StatsService,) {}

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
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
    } else {
      this.router.navigate(['/auth/login'])
    }
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
