import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import {jsPDF}  from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ExcelService } from 'src/app/pages/excel.service';

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
  selector: 'app-lists-widget11',
  templateUrl: './lists-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget11Component {


  shiftForm = new FormGroup({
    operator: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    shiftTimeId: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  pumpCity: any;
  userId: any;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelShiftTimeDetails: any = [];
  shiftWiseData: any = [];
  shiftWiseQuantityData: any = [];
  meterSalesAmount: any = [];
  shiftDetails: any = [];
  staffDetails: any = [];
  shiftWiseDataExcel: any = [];
  productsList: any;
  shiftWiseQuantityDataExcel: any = [];

  constructor(
    private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.pumpCity = dealerData.city
    this.userId = element.userId;
    this.dealerLoginId = element.veelsPlusCorporateID;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.brandName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.getShiftDetails(this.fuelDealerId)
    this.getAllAttendantsByDid(this.fuelDealerId)
    this.getProductsByDealerId(this.fuelDealerId)
    this.cd.detectChanges()
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


  pageChangeEvent(event: number) {
    this.p = event;
    this.getShiftWiseBookDetailsBYOperator();
  }

  getShiftDetails(dealerId: any) {
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: dealerId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetails = res.data;
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetails.length = 0;
            this.cd.detectChanges()
          }
        }
        else {
        }
      })
  }
  
  getAllAttendantsByDid(fuelDealerId: any) {
    const data = {
        fuelDealerId: fuelDealerId,
    };
    this.post.getAllAttendantsByDidPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
            this.staffDetails = res.data;
            this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
    });
}

  getShiftWiseBookDetailsBYOperator(){
    if(this.shiftForm.value.startDate || this.shiftForm.value.endDate){
  
    if(this.shiftForm.value.operatorStaffId && this.shiftForm.value.shiftTimeId){
        this.shiftWiseData.length = 0;
        this.shiftWiseQuantityData.length = 0;
            const data = {
                dealerId: this.fuelDealerId,
                startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
                endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                staffId: this.shiftForm.value.operatorStaffId,
                shiftTimeId: this.shiftForm.value.shiftTimeId,
            };
            this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
                if (res.status == 'OK') {
                    this.meterSalesAmount = res.data;
                    this.shiftDetails = res.data1;
                    if(res.data1.length || res.data.length){
                        
                      this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
                        const dataPAYJson = {
                          openDate: '',
                          name: '',
                          meterSaleAmount: 0,
                          cash: '',
                          digital:'',
                          credit: '',
                          expenses: '',
                          short: '',
                          shiftTally: '',
                          shiftTime: '',
                        };
          
                          dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                          dataPAYJson.name = shift.firstName+' '+shift.lastName;
                          dataPAYJson.cash = shift.totalCashTally;
                          dataPAYJson.digital = shift.paytmTotalAmount;
                          dataPAYJson.credit = shift.totalCreditTally;
                          dataPAYJson.expenses = shift.expenseAmount;
                          dataPAYJson.short = shift.shortamount;
                          dataPAYJson.shiftTally = shift.totalAmountTally;
                          dataPAYJson.shiftTime = shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName;
        
                          this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
                            if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
                                dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                            }
                        })
          
                          this.shiftWiseData.push(dataPAYJson);
                      })     
                      this.cd.detectChanges()
                    }   else {
                        alert("Data Not found..")
                        this.getShiftWiseBookDetails(this.fuelDealerId);
                        this.shiftForm.controls["operatorStaffId"].setValue("")
                        this.cd.detectChanges()
      
                    }
        
                } else {
                }
            });   
            
            this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
              if(res.status == 'OK'){
                if(res.data.length){
                  if(res.data1.length){
                    res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                      const dataJson = {
                        fuelProductId:'',
                        fuelShiftDetailsId: '',
                        meterSaleAmount: '',
                        meterSaleQuantity: '',
                        openDate:'',
                        productName:'',
                        creditQuantity: '', 
                        fuelShiftTimeShiftName:'',
                        fuelShiftTimeDetails:'',
                        firstName:'',
                        lastName:'',
                      };
                      dataJson.fuelProductId = res1.fuelProductId;
                      dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                      dataJson.meterSaleAmount = res1.meterSaleAmount;
                      dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                      dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                      dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                      dataJson.openDate = res1.openDate;
                      dataJson.productName = res1.productName;
                      dataJson.firstName = res1.firstName;
                      dataJson.lastName = res1.lastName;
                      res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                        if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                          dataJson.creditQuantity = res2.creditQuantity;
                        }
                      })
                       
          
                      this.shiftWiseQuantityData.push(dataJson); 
                     
                      })
                      this.cd.detectChanges()
                  }else{
                    this.shiftWiseQuantityData = res.data;
                    this.cd.detectChanges()
                  }
                }else{
                  this.shiftWiseQuantityData = []
                  this.cd.detectChanges()
                }
              }
            })     
    }else{
        if(this.shiftForm.value.operatorStaffId){
            this.shiftWiseData.length = 0;
            this.shiftWiseQuantityData.length = 0;
                const data = {
                    dealerId: this.fuelDealerId,
                    startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
                    endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                    staffId: this.shiftForm.value.operatorStaffId,
                };
                this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
                    if (res.status == 'OK') {
                        this.meterSalesAmount = res.data;
                        this.shiftDetails = res.data1;
                        if(res.data1.length || res.data.length){
                            
                          this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
                            const dataPAYJson = {
                              openDate: '',
                              name: '',
                              meterSaleAmount: 0,
                              cash: '',
                              digital:'',
                              credit: '',
                              expenses: '',
                              short: '',
                              shiftTally: '',
                              shiftTime: '',
                            };
              
                              dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                              dataPAYJson.name = shift.firstName+' '+shift.lastName;
                              dataPAYJson.cash = shift.totalCashTally;
                              dataPAYJson.digital = shift.paytmTotalAmount;
                              dataPAYJson.credit = shift.totalCreditTally;
                              dataPAYJson.expenses = shift.expenseAmount;
                              dataPAYJson.short = shift.shortamount;
                              dataPAYJson.shiftTally = shift.totalAmountTally;
                              dataPAYJson.shiftTime = shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName;
            
                              this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
                                if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
                                    dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                                }
                            })
              
                              this.shiftWiseData.push(dataPAYJson);
                          })  
                          this.cd.detectChanges()   
                        }   else {
                            alert("Data Not found..")
                            this.getShiftWiseBookDetails(this.fuelDealerId);
                            this.shiftForm.controls["operatorStaffId"].setValue("")
                            this.cd.detectChanges()
          
                        }
            
                    } else {
                    }
                });   
                
          this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
            if(res.status == 'OK'){
              if(res.data.length){
                if(res.data1.length){
                  res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                    const dataJson = {
                      fuelProductId:'',
                      fuelShiftDetailsId: '',
                      meterSaleAmount: '',
                      meterSaleQuantity: '',
                      openDate:'',
                      productName:'',
                      creditQuantity: '',
                      fuelShiftTimeShiftName:'',
                      fuelShiftTimeDetails:'', 
                      firstName:'',
                      lastName:'',
                    };
                    dataJson.fuelProductId = res1.fuelProductId;
                    dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                    dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                    dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                    dataJson.meterSaleAmount = res1.meterSaleAmount;
                    dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                    dataJson.openDate = res1.openDate;
                    dataJson.productName = res1.productName;
                    dataJson.firstName = res1.firstName;
                    dataJson.lastName = res1.lastName;
                    res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                      if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                        dataJson.creditQuantity = res2.creditQuantity;
                      }
                    })
                     
        
                    this.shiftWiseQuantityData.push(dataJson); 
                    this.cd.detectChanges()
                   
                    })
                }else{
                  this.shiftWiseQuantityData = res.data;
                  this.cd.detectChanges()
                }
              }else{
                this.shiftWiseQuantityData = []
                this.cd.detectChanges()
              }
            }
          })     
        }else{
            if(this.shiftForm.value.shiftTimeId){
                this.shiftWiseData.length = 0;
                this.shiftWiseQuantityData.length = 0;
                    const data = {
                        dealerId: this.fuelDealerId,
                        startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
                        endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                        shiftTimeId: this.shiftForm.value.shiftTimeId,
                    };
                    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
                        if (res.status == 'OK') {
                            this.meterSalesAmount = res.data;
                            this.shiftDetails = res.data1;
                            if(res.data1.length || res.data.length){
                                
                              this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
                                const dataPAYJson = {
                                  openDate: '',
                                  name: '',
                                  meterSaleAmount: 0,
                                  cash: '',
                                  digital:'',
                                  credit: '',
                                  expenses: '',
                                  short: '',
                                  shiftTally: '',
                                  shiftTime: '',
                                };
                  
                                  dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                                  dataPAYJson.name = shift.firstName+' '+shift.lastName;
                                  dataPAYJson.cash = shift.totalCashTally;
                                  dataPAYJson.digital = shift.paytmTotalAmount;
                                  dataPAYJson.credit = shift.totalCreditTally;
                                  dataPAYJson.expenses = shift.expenseAmount;
                                  dataPAYJson.short = shift.shortamount;
                                  dataPAYJson.shiftTally = shift.totalAmountTally;
                                  dataPAYJson.shiftTime = shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName;
                
                                  this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
                                    if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
                                        dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                                    }
                                })
                  
                                  this.shiftWiseData.push(dataPAYJson);
                              })     
                              this.cd.detectChanges()
                            }   else {
                                alert("Data Not found..")
                                this.getShiftWiseBookDetails(this.fuelDealerId);
                                this.shiftForm.controls["operatorStaffId"].setValue("")
                                this.cd.detectChanges()
              
                            }
                
                        } else {
                        }
                    });    
                    
                    
                  this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
                    if(res.status == 'OK'){
                      if(res.data.length){
                        if(res.data1.length){
                          res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                            const dataJson = {
                              fuelProductId:'',
                              fuelShiftDetailsId: '',
                              meterSaleAmount: '',
                              meterSaleQuantity: '',
                              openDate:'',
                              productName:'',
                              creditQuantity: '', 
                              fuelShiftTimeShiftName:'',
                              fuelShiftTimeDetails:'',
                              firstName:'',
                              lastName:'',
                            };
                            dataJson.fuelProductId = res1.fuelProductId;
                            dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                            dataJson.meterSaleAmount = res1.meterSaleAmount;
                            dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                            dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                            dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                            dataJson.openDate = res1.openDate;
                            dataJson.productName = res1.productName;
                            dataJson.firstName = res1.firstName;
                            dataJson.lastName = res1.lastName;
                            res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                              if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                                dataJson.creditQuantity = res2.creditQuantity;
                              }
                            })
                             
                
                            this.shiftWiseQuantityData.push(dataJson); 
                            this.cd.detectChanges()
                           
                            })
                        }else{
                          this.shiftWiseQuantityData = res.data;
                          this.cd.detectChanges()
                        }
                      }else{
                        this.shiftWiseQuantityData = []
                        this.cd.detectChanges()
                      }
                    }
                  })
            }else{
                this.getShiftWiseBookDetails(this.fuelDealerId);
                this.cd.detectChanges()
            }
        }
    }
  
    }else{
            alert("Please Select Date..!")
        }
  }
  
 getShiftWiseBookDetails(fuelDealerId: any) {       
  this.shiftWiseData.length = 0;
  this.shiftWiseQuantityData.length = 0;
  const data = {
      dealerId: fuelDealerId,
      startDate:moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //startDate,
      endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
  };
  this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
          this.meterSalesAmount = res.data;
          this.shiftDetails = res.data1;

            this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
              const dataPAYJson = {
                openDate: '',
                name: '',
                meterSaleAmount: 0,
                cash: '',
                digital:'',
                credit: '',
                expenses: '',
                short: '',
                shiftTally: '',
                shiftTime: '',
              };

                dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                dataPAYJson.name = shift.firstName+' '+shift.lastName;
                dataPAYJson.cash = shift.totalCashTally;
                dataPAYJson.digital = shift.paytmTotalAmount;
                dataPAYJson.credit = shift.totalCreditTally;
                dataPAYJson.expenses = shift.expenseAmount;
                dataPAYJson.short = shift.shortamount;
                dataPAYJson.shiftTally = shift.totalAmountTally;
                dataPAYJson.shiftTime = shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName;

                this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
                  if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
                      dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                  }
              })

                this.shiftWiseData.push(dataPAYJson);
                this.cd.detectChanges()
            })
      } else {
      }
  });

  this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
    if(res.status == 'OK'){
      if(res.data.length){
        if(res.data1.length){
          res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
            const dataJson = {
              fuelProductId:'',
              fuelShiftDetailsId: '',
              meterSaleAmount: '',
              meterSaleQuantity: '',
              openDate:'',
              productName:'',
              creditQuantity: '', 
              fuelShiftTimeShiftName:'',
              fuelShiftTimeDetails:'',
              firstName:'',
              lastName:'',
            };
            dataJson.fuelProductId = res1.fuelProductId;
            dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
            dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
            dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
            dataJson.meterSaleAmount = res1.meterSaleAmount;
            dataJson.meterSaleQuantity = res1.meterSaleQuantity;
            dataJson.openDate = res1.openDate;
            dataJson.productName = res1.productName;
            dataJson.firstName = res1.firstName;
            dataJson.lastName = res1.lastName;
            res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
              if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                dataJson.creditQuantity = res2.creditQuantity;
              }
            })
             

            this.shiftWiseQuantityData.push(dataJson); 
            this.cd.detectChanges()
           
            })
        }else{
          this.shiftWiseQuantityData = res.data;
          this.cd.detectChanges()
        }
      }else{
        this.shiftWiseQuantityData = []
        this.cd.detectChanges()
      }
    }
  })
}

exportPDFamount(){
  var cols = [["date", "shift", "operatorName","meterSales", "credit_A","digital_B","cash_c","expenses","short","shiftTally_ABC"]];
  var rows = [];
  for (var key in this.shiftWiseData) {
  
    var temp = [
      moment(this.shiftWiseData[key].openDate).format("DD-MM-YYYY"),
      this.shiftWiseData[key].shiftTime,
      this.shiftWiseData[key].name,
      Number(this.shiftWiseData[key].meterSaleAmount).toFixed(2),
      Number(this.shiftWiseData[key].credit).toFixed(2),
      Number(this.shiftWiseData[key].digital).toFixed(2),
      Number(this.shiftWiseData[key].cash).toFixed(2),
      Number(this.shiftWiseData[key].expenses).toFixed(2),
      Number(this.shiftWiseData[key].short).toFixed(2),
      Number(this.shiftWiseData[key].shiftTally).toFixed(2),
      
      ];
      rows.push(temp);
  }

  var doc = new jsPDF('l', 'pt');

  doc.setFontSize(20);  
  doc.text("shiftBook_shiftwise",350, 35 );  
  doc.setFontSize(10);

   autoTable(doc, {
    columnStyles: {
      0: {cellWidth: 70},     // OnboardDate
      1: {cellWidth: 120},    // CompanyId
      2: {cellWidth: 120},     //FuelPartnerName
      3: {cellWidth: 70},     //OnboardingStatus
      4: {cellWidth: 60},     //PaymentStatus
      5: {cellWidth: 60},     //WaiveOffAction
      6: {cellWidth: 60},     //SMSReceiveStatus
      7: {cellWidth: 60},     //EmailReceiveStatus
      8: {cellWidth: 50},     //ActivePump
      9: {cellWidth: 70},     //ActivePump

    },
    
    margin: {top: 50},
    head: cols,
    body: rows,
    theme: 'grid',
    didDrawCell: (data) => { },
});
  // doc.output('dataurlnewwindow')
  doc.save("shiftBook_shiftwise.pdf");
        
}


exportExcelamount(){
  this.shiftWiseDataExcel.length = 0

  this.shiftWiseData.map((res: { openDate: moment.MomentInput; shiftTime: any; name: any; meterSaleAmount: any; credit: any; digital: any; cash: any; expenses: any; short: any; shiftTally: any; }) => {

    let json = {
      date: moment(res.openDate).format("DD-MM-YYYY"),
      shift: res.shiftTime,
      operatorName: res.name,
      meterSales: Number(res.meterSaleAmount).toFixed(2),
      credit_A: Number(res.credit).toFixed(2),
      digital_B: Number(res.digital).toFixed(2),
      cash_c: Number(res.cash).toFixed(2),
      expenses: Number(res.expenses).toFixed(2),
      short: Number(res.short).toFixed(2),
      shiftTally_ABC: Number(res.shiftTally).toFixed(2),
    };

    this.shiftWiseDataExcel.push(json);
  });

  this.excelService.exportAsExcelFile(
    this.shiftWiseDataExcel,
    "shiftBook_shiftwise"
  );

}

getByProduct(id:any){
  if(this.shiftForm.value.operatorStaffId && this.shiftForm.value.shiftTimeId){
    this.shiftWiseQuantityData.length = 0;
    const data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
        endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        staffId: this.shiftForm.value.operatorStaffId,
        shiftTimeId: this.shiftForm.value.shiftTimeId,
        fuelProductId: id.target.value
    };
    this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
      if(res.status == 'OK'){
        if(res.data.length){
          if(res.data1.length){
            res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
              const dataJson = {
                fuelProductId:'',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate:'',
                productName:'',
                creditQuantity: '',
                fuelShiftTimeShiftName:'',
                fuelShiftTimeDetails:'', 
                firstName:'',
                lastName:'',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
              dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              dataJson.firstName = res1.firstName;
              dataJson.lastName = res1.lastName;
              res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })
               
  
              this.shiftWiseQuantityData.push(dataJson); 
              this.cd.detectChanges()
             
              })
          }else{
            this.shiftWiseQuantityData = res.data;
            this.cd.detectChanges()
          }
        }else{
          this.shiftWiseQuantityData = []
          this.cd.detectChanges()
        }
      }
    })
  }else{
    if(this.shiftForm.value.operatorStaffId ){
      this.shiftWiseQuantityData.length = 0;
      const data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
          endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          staffId: this.shiftForm.value.operatorStaffId, 
          fuelProductId: id.target.value
      };
      this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
        if(res.status == 'OK'){
          if(res.data.length){
            if(res.data1.length){
              res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                const dataJson = {
                  fuelProductId:'',
                  fuelShiftDetailsId: '',
                  meterSaleAmount: '',
                  meterSaleQuantity: '',
                  openDate:'',
                  productName:'',
                  creditQuantity: '', 
                  fuelShiftTimeShiftName:'',
                  fuelShiftTimeDetails:'',
                  firstName:'',
                  lastName:'',
                };
                dataJson.fuelProductId = res1.fuelProductId;
                dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                dataJson.meterSaleAmount = res1.meterSaleAmount;
                dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                dataJson.openDate = res1.openDate;
                dataJson.productName = res1.productName;
                dataJson.firstName = res1.firstName;
                dataJson.lastName = res1.lastName;
                res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                  if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                    dataJson.creditQuantity = res2.creditQuantity;
                  }
                })
                 
    
                this.shiftWiseQuantityData.push(dataJson); 
                this.cd.detectChanges()
               
                })
            }else{
              this.shiftWiseQuantityData = res.data;
              this.cd.detectChanges()
            }
          }else{
            this.shiftWiseQuantityData = []
            this.cd.detectChanges()
          }
        }
      })
    }else{
      if(this.shiftForm.value.shiftTimeId){
        this.shiftWiseQuantityData.length = 0;
        const data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  
            endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), 
            shiftTimeId: this.shiftForm.value.shiftTimeId,
            fuelProductId: id.target.value
        };
        this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
          if(res.status == 'OK'){
            if(res.data.length){
              if(res.data1.length){
                res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                  const dataJson = {
                    fuelProductId:'',
                    fuelShiftDetailsId: '',
                    meterSaleAmount: '',
                    meterSaleQuantity: '',
                    openDate:'',
                    productName:'',
                    creditQuantity: '', 
                    fuelShiftTimeShiftName:'',
                    fuelShiftTimeDetails:'',
                    firstName:'',
                    lastName:'',
                  };
                  dataJson.fuelProductId = res1.fuelProductId;
                  dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                  dataJson.meterSaleAmount = res1.meterSaleAmount;
                  dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                  dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                  dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                  dataJson.openDate = res1.openDate;
                  dataJson.productName = res1.productName;
                  dataJson.firstName = res1.firstName;
                  dataJson.lastName = res1.lastName;
                  res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                    if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                      dataJson.creditQuantity = res2.creditQuantity;
                    }
                  })
                   
      
                  this.shiftWiseQuantityData.push(dataJson); 
                  this.cd.detectChanges()
                 
                  })
              }else{
                this.shiftWiseQuantityData = res.data;
                this.cd.detectChanges()
              }
            }else{
              this.shiftWiseQuantityData = []
              this.cd.detectChanges()
            }
          }
        })
      }else{            
        this.shiftWiseQuantityData.length = 0;
        const data = {
            dealerId: this.fuelDealerId,
            startDate:moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //startDate,
            endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            fuelProductId: id.target.value
        };      
      this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
        if(res.status == 'OK'){
          if(res.data.length){
            if(res.data1.length){
              res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
                const dataJson = {
                  fuelProductId:'',
                  fuelShiftDetailsId: '',
                  meterSaleAmount: '',
                  meterSaleQuantity: '',
                  openDate:'',
                  productName:'',
                  creditQuantity: '', 
                  fuelShiftTimeShiftName:'',
                  fuelShiftTimeDetails:'',
                  firstName:'',
                  lastName:'',
                };
                dataJson.fuelProductId = res1.fuelProductId;
                dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                dataJson.meterSaleAmount = res1.meterSaleAmount;
                dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                dataJson.openDate = res1.openDate;
                dataJson.productName = res1.productName;
                dataJson.firstName = res1.firstName;
                dataJson.lastName = res1.lastName;
                res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                  if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                    dataJson.creditQuantity = res2.creditQuantity;
                  }
                })

                this.shiftWiseQuantityData.push(dataJson); 
                this.cd.detectChanges()
               
                })
            }else{
              this.shiftWiseQuantityData = res.data;
              this.cd.detectChanges()
            }
          }else{
            this.shiftWiseQuantityData = []
            this.cd.detectChanges()
          }
        }
      })
      }
    }
  
  }

}

getProductsByDealerId(fuelDealerId: any) {
  let data = {
    fuelDealerId:fuelDealerId
  }
  this.post.getFuelProductIdByDealerIdPOST(data).subscribe(res=>
    {
      if (res.status = 'OK')
      { 
        this.productsList = res.data;  
      }
  })
}

exportPDFQuantity(){
        
  var cols = [["date", "shift", "operatorName","Product", "Credit_Quantity","MeterSales_Quantity","MeterSales_Amount"]];
  var rows = [];
  for (var key in this.shiftWiseQuantityData) {
  
    var temp = [
      moment(this.shiftWiseQuantityData[key].openDate).format("DD-MM-YYYY"),
      this.shiftWiseQuantityData[key].fuelShiftTimeDetails,
      this.shiftWiseQuantityData[key].firstName + " " + this.shiftWiseQuantityData[key].lastName,
      this.shiftWiseQuantityData[key].productName,
      Number(this.shiftWiseQuantityData[key].creditQuantity).toFixed(2),
      Number(this.shiftWiseQuantityData[key].meterSaleQuantity).toFixed(2),
      Number(this.shiftWiseQuantityData[key].meterSaleAmount).toFixed(2),    
      ];
      rows.push(temp);
  }

  var doc = new jsPDF('l', 'pt');

  doc.setFontSize(20);  
  doc.text("shiftBook_shiftwise",350, 35 );  
  doc.setFontSize(10);

   autoTable(doc, {
    columnStyles: {
      0: {cellWidth: 80},     // OnboardDate
      1: {cellWidth: 150},    // CompanyId
      2: {cellWidth: 140},     //FuelPartnerName
      3: {cellWidth: 70},     //OnboardingStatus
      4: {cellWidth: 60},     //PaymentStatus
      5: {cellWidth: 90},     //WaiveOffAction
      6: {cellWidth: 90},     //SMSReceiveStatus
      
    },
    
    margin: {top: 50},
    head: cols,
    body: rows,
    theme: 'grid',
    didDrawCell: (data) => { },
});
  doc.save("shiftBook_shiftwise.pdf");
        
}

exportExcelQuantity(){
  this.shiftWiseQuantityDataExcel.length = 0

  this.shiftWiseQuantityData.map((res: { openDate: moment.MomentInput; fuelShiftTimeDetails: any; firstName: string; lastName: string; productName: any; creditQuantity: any; meterSaleQuantity: any; meterSaleAmount: any; }) => {

    let json = {
      Date: moment(res.openDate).format("DD-MM-YYYY"),
      Shift: res.fuelShiftTimeDetails,
      operatorName: res.firstName + " " + res.lastName,
      Product: res.productName,
      Credit_Quantity: Number(res.creditQuantity).toFixed(2),
      MeterSales_Quantity: Number(res.meterSaleQuantity).toFixed(2),
      MeterSales_Amount: Number(res.meterSaleAmount).toFixed(2),
    };
    this.shiftWiseQuantityDataExcel.push(json);
  });

  this.excelService.exportAsExcelFile(
    this.shiftWiseQuantityDataExcel,
    "shiftBook_shiftwise"
  );

}
}
