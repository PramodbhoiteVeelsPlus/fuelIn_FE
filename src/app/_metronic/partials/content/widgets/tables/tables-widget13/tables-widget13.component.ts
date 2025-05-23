import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  dealerId: any;
  modalReference: any;
  closeResult: string;
  allCustList: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  activeCustList: any = [];
  modalReference1: any;
  managerDetails: any = [];
  operatorDetails: any = [];
  modalReference3: any;
  modalReference2: any;
  posDetails: any;
  modalReference4: any;
  modalReference5: any;
  tankDetails: any;
  modalReference6: any;
  PumpDetails: any;
  modalReference7: any;
  NozzleDetails: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
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
        fuelDealerId: ''
      };

      dataJson.pumpName = res1.companyName;
      dataJson.fuelDealerId = res1.fuelDealerId

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
  
    custName(cust: any,fuelDealerId: any){
      this.dealerId = fuelDealerId
      this.modalReference = this.modalService.open(cust)
      this.modalReference.result.then((result: any) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  
      this.getAllCustList()
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
    
  getAllCustList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getAllCustomerListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.allCustList = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.allCustList = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllCustList();
  }

  activeCustomer(activeCust: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference1 = this.modalService.open(activeCust)
    this.modalReference1.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getActiveCustList()
  }
   
  getActiveCustList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getActiveCustListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.activeCustList = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.activeCustList = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent1(event: number) {
    this.p = event;
    this.getActiveCustList();
  }
  
  managerName(manager: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference2 = this.modalService.open(manager)
    this.modalReference2.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getManagerList()
  }
  
  getManagerList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getManagerListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.managerDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.managerDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent2(event: number) {
    this.p = event;
    this.getManagerList();
  }
  
  operatorName(operator: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference3 = this.modalService.open(operator)
    this.modalReference3.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getOperatorList()
  }
  
  getOperatorList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getOperatorListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.operatorDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.operatorDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent3(event: number) {
    this.p = event;
    this.getOperatorList();
  }
   
  posName(pos: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference4 = this.modalService.open(pos)
    this.modalReference4.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getPosList()
  }
  
  getPosList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getPosListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.posDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.posDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent4(event: number) {
    this.p = event;
    this.getPosList();
  }
  
  tankName(tank: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference5 = this.modalService.open(tank)
    this.modalReference5.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getTankList()
  }
  
  getTankList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getTankListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.tankDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.tankDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent5(event: number) {
    this.p = event;
    this.getTankList();
  }
  
  pumpName(pump: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference6 = this.modalService.open(pump)
    this.modalReference6.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getPumpList()
  }
  
  getPumpList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getPumpListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.PumpDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.PumpDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent6(event: number) {
    this.p = event;
    this.getPumpList();
  }
  
  nozzleName(nozzle: any,fuelDealerId: any){
    this.dealerId = fuelDealerId
    this.modalReference7 = this.modalService.open(nozzle)
    this.modalReference7.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getNozzleList()
  }
  
  getNozzleList() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.dealerId
    }
    this.post.getNzListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.NozzleDetails = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.NozzleDetails = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  
  pageChangeEvent7(event: number) {
    this.p = event;
    this.getNozzleList();
  }
}
