import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';

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
  selector: 'app-tables-widget13',
  templateUrl: './tables-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget13Component implements OnInit {
  dealerList: any = [];
  fuelDealerId: any;
  allCustomerList: any = [];
  allCustomerListDetails: any = [];
  activeCustomerList: any = [];
  activeCustomerListDetails: any = [];
  managerList: any = [];
  managerListDetails: any = [];
  operatorList: any = [];
  operatorListDetails: any = [];
  posList: any = [];
  posListDetails: any = [];
  duNzTkList: any = [];
  duNzTkListDetails: any = [];
  allDealerList: any = [];
  allDealerDetails: any = [];
  searchData: any;
  allDealerDetailsSearch: any = [];

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    // this.getDealerList();
    this.getAllDealerList()
    this.cd.detectChanges();
  }


  getAllDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        this.getCustomersCountDealerWise();
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  getDetailsByCustomerMapName(id: any) {
    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          // this.getCreditDetailsMonthWise()
          this.cd.detectChanges();
        } else {
        }
      });
  }

  // //getAllDealerList
  // getAllDealerList() {

  //   this.post.getAllDealerListPOST()
  //     .subscribe(res => {
  //       if (res) {
  //         this.dealerList = res
  //         this.dealerList.data.map(
  //           (            detail: any) => {
  //             this.allDealerList.push(detail)
  //           })
  //           this.getAllFastagDetails()
  //       } else {
  //       }
  //     });
  // }

  //getCustomersCountDealerWiseURL
  getCustomersCountDealerWise() {
    this.spinner.show()
    let data = {

    }

    this.post.getCustomersCountDealerWisePOST(data)
      .subscribe(res => {
        if (res) {
          this.allCustomerList = res
          this.allCustomerList.data.map(
            (detail: any) => {
              this.allCustomerListDetails.push(detail)
            })
          this.activeCustomerList = res
          this.activeCustomerList.data1.map(
            (detail: any) => {
              this.activeCustomerListDetails.push(detail)
            })

          this.getSTAFFnPOSPumpCountDealerWise();
          this.spinner.hide()
          this.cd.detectChanges();

        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }


  //getSTAFFnPOSPumpCountDealerWise
  getSTAFFnPOSPumpCountDealerWise() {
    this.spinner.show()
    let data = {

    }

    this.post.getSTAFFnPOSPumpCountDealerWisePOST(data)
      .subscribe(res => {
        if (res) {
          this.managerList = res
          this.managerList.data.map(
            (detail: any) => {
              this.managerListDetails.push(detail)
            })
          this.operatorList = res
          this.operatorList.data1.map(
            (detail: any) => {
              this.operatorListDetails.push(detail)
            })
          this.posList = res
          this.posList.data2.map(
            (detail: any) => {
              this.posListDetails.push(detail)
            })
          this.duNzTkList = res
          this.duNzTkList.data3.map(
            (detail: any) => {
              this.duNzTkListDetails.push(detail)
            })

          this.getCombine()
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getCombine() {
    this.dealerList.map((res1: { companyName: string; fuelDealerId: any; }) => {
      const dataJson = {
        pumpName: '',
        allCustCount: 0,
        activeCustCount: 0,
        managerCount: 0,
        operatorCount: 0,
        posCount: 0,
        tankCount: 0,
        pumpCount: 0,
        nzCount: 0,
      };

      dataJson.pumpName = res1.companyName;

      this.allCustomerListDetails.map((res2: { fuelDealerId: any; allCustomers: number; }) => {
        if (res1.fuelDealerId == res2.fuelDealerId) {
          dataJson.allCustCount = res2.allCustomers;
        }
      })

      this.activeCustomerListDetails.map((res3: { fuelDealerId: any; activeCustomers: number; }) => {
        if (res1.fuelDealerId == res3.fuelDealerId) {
          dataJson.activeCustCount = res3.activeCustomers;
        }
      })

      this.managerListDetails.map((res4: { fuelDealerId: any; managerCount: number; }) => {
        if (res1.fuelDealerId == res4.fuelDealerId) {
          dataJson.managerCount = res4.managerCount;
        }
      })

      this.operatorListDetails.map((res5: { fuelDealerId: any; operatorCount: number; }) => {
        if (res1.fuelDealerId == res5.fuelDealerId) {
          dataJson.operatorCount = res5.operatorCount;
        }
      })

      this.posListDetails.map((res6: { fuelDealerId: any; posCount: number; }) => {
        if (res1.fuelDealerId == res6.fuelDealerId) {
          dataJson.posCount = res6.posCount;
        }
      })

      this.duNzTkListDetails.map((res7: { fuelDealerId: any; tankCount: number; pumpCount: number; nzCount: number; }) => {
        if (res1.fuelDealerId == res7.fuelDealerId) {
          dataJson.tankCount = res7.tankCount;
          dataJson.pumpCount = res7.pumpCount;
          dataJson.nzCount = res7.nzCount;
        }
      })


      this.allDealerDetails.push(dataJson);
      this.allDealerDetailsSearch.push(dataJson);
      this.cd.detectChanges();
    })
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.allDealerDetails = this.allDealerDetailsSearch.filter((item: { pumpName: any; }) =>
      item.pumpName.toLowerCase().includes(query)
    );
  }
}
