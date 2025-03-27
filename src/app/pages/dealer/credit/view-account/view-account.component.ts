import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';
import { WidgetService } from 'src/app/_metronic/partials/content/widgets/widgets.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';
  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }
  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }
  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrl: './view-account.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ViewAccountComponent {
  dealerMobile: any;
  dealerLoginVPId: any;
  loginCorporateId: any;
  customerId: any;
  acceesGroup: number;
  kycId: any;
  fuelDealerId: any;
  advanceAmt: any;
  crOutstanding2: any = 0;
  isAdmin: boolean = false;
  isDealer: boolean = false;
  isTransporter: boolean = false;
  dealerCorporateId: string | null;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.fuelDealerId = localStorage.getItem("dealerId");
      this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
      this.dealerMobile = element.phone1;
      this.dealerLoginVPId = element.veelsPlusCorporateID;
      this.acceesGroup = element.accessGroupId;
      // this.getCorporateById();
      this.getMappingAccount(this.fuelDealerId)
      this.getfuelDealerIdByCorporateId(this.dealerCorporateId);
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
    } else {
      this.router.navigate(['/auth/login'])
    }
    // this.cd.detectChanges()
  }

  getCorporateById() {
    let data = {
      veelsplusCorporateId: this.dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.loginCorporateId = res.data[0].corporateId;
          // this.customerId = res.data[0].customerId;
          this.kycId = res.data[0].kycId;
          if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
            // this.searchDealerBycustomerId(this.customerId)
          } else {

          }
        }
        else {
          // this.spinner.hide();
        }
      })
  }

  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          // this.getMappingAccount(this.fuelDealerId)
          this.cd.detectChanges()
          // this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId);
        }
        else {
          // this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }
  
  getMappingAccount(fuelDealerId: any){
    // this.spinner.show();
    // this.crOutstanding2 = 0
    this.advanceAmt = 0
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getMappingAccByFuelDealerIdPOST(data)
    .subscribe(res => {
      if(res.status == "OK"){
        res.data.map((res: { netOS: any; })=>{      
            this.crOutstanding2 = this.crOutstanding2 + (Number(res.netOS))  
          if((Number(res.netOS)) < 0){ 
            this.advanceAmt = this.advanceAmt + (Number(res.netOS)) 
          } 
        })
        // this.spinner.hide();
        this.cd.detectChanges()
      } else{
        // this.spinner.hide();
        this.cd.detectChanges()
      }
    })
  }
}
