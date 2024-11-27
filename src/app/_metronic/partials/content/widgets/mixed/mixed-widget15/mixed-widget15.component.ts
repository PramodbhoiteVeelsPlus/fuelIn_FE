import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import numWords from 'num-words';
import { ListWidgetService } from '../../lists/listWidget.services';
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
  selector: 'app-mixed-widget15',
  templateUrl: './mixed-widget15.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget15Component implements OnInit {
  shiftForm = new FormGroup({
    operator: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    shiftTimeId: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    terminalId: new FormControl('', Validators.required),
  });
  accessGroup: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any;
  posData: any = [];
  posDetails: any = [];
  fuelShiftTimeDetails: any = [];
  staffDetails: any = [];
  terminalDetails: any = [];
  posDataExcel: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(
    private post: MixedService,
    private post1: ListWidgetService,
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

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.getAllAttendantsByDid(this.fuelDealerId)
    this.getShiftDetails(this.fuelDealerId)
    this.getPosTerminals(this.fuelDealerId)
    this.getPosDetails(this.fuelDealerId)
    this.cd.detectChanges()
  }

  
  pageChangeEvent(event: number) {
    this.p = event;
    this.getPosDetailsByOperatorTerminal();
  }

  getPosDetailsByOperatorTerminal() {
    if (this.shiftForm.value.startDate || this.shiftForm.value.endDate) {
      this.spinner.show();
      if (this.shiftForm.value.operatorStaffId && this.shiftForm.value.shiftTimeId && this.shiftForm.value.terminalId) {
        this.spinner.show();
        this.posData.length = 0;
        const data = {
          fuelDealerId: this.fuelDealerId,
          startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          fuelDealerStaffId: this.shiftForm.value.operatorStaffId,
          shiftTimeId: this.shiftForm.value.shiftTimeId,
          fuelTerminalsId: this.shiftForm.value.terminalId,
        };
        this.post.getPosDetailsPOST(data).subscribe((res) => {
          if (res.status == 'OK') {

            this.posDetails = res.data;
            if (res.data.length) {
              // this.spinner.show();
              this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                const dataJSON = {
                  openDate: '',
                  shift: '',
                  name: '',
                  pos: '',
                  paytmTotalAmount: 0,
                  details: '',
                };
                dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                dataJSON.name = shift.firstName + ' ' + shift.lastName;
                dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                dataJSON.pos = shift.terminalName;
                dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                dataJSON.details = shift.transacId;

                this.posData.push(dataJSON);
                this.spinner.hide();
                this.cd.detectChanges()

              })
            } else {
              alert("Data Not found..")
              this.getPosDetails(this.fuelDealerId);
              this.shiftForm.controls["shiftTimeId"].setValue("")
              this.shiftForm.controls["operatorStaffId"].setValue("")
              this.shiftForm.controls["terminalId"].setValue("")
              this.spinner.hide();
              this.cd.detectChanges()

            }

          } else {
            this.spinner.hide();
            this.cd.detectChanges()

          }

        });
      } else {
        if (this.shiftForm.value.operatorStaffId && this.shiftForm.value.shiftTimeId) {
          this.spinner.show();

          this.posData.length = 0;
          const data = {
            fuelDealerId: this.fuelDealerId,
            startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            fuelDealerStaffId: this.shiftForm.value.operatorStaffId,
            shiftTimeId: this.shiftForm.value.shiftTimeId
          };
          this.post.getPosDetailsPOST(data).subscribe((res) => {
            if (res.status == 'OK') {
              this.posDetails = res.data;
              if (res.data.length) {
                // this.spinner.show();
                this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                  const dataJSON = {
                    openDate: '',
                    shift: '',
                    name: '',
                    pos: '',
                    paytmTotalAmount: 0,
                    details: '',
                  };
                  dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                  dataJSON.name = shift.firstName + ' ' + shift.lastName;
                  dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                  dataJSON.pos = shift.terminalName;
                  dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                  dataJSON.details = shift.transacId;

                  this.posData.push(dataJSON);
                  this.spinner.hide();
                  this.cd.detectChanges()

                })
              } else {
                alert("Data Not found..")
                this.getPosDetails(this.fuelDealerId);
                this.shiftForm.controls["shiftTimeId"].setValue("")
                this.shiftForm.controls["operatorStaffId"].setValue("")
                this.spinner.hide();
                this.cd.detectChanges()

              }

            } else {
              this.spinner.hide();
              this.cd.detectChanges()
            }
          });
        } else {
          if (this.shiftForm.value.shiftTimeId && this.shiftForm.value.terminalId) {
            this.spinner.show();

            this.posData.length = 0;
            const data = {
              fuelDealerId: this.fuelDealerId,
              startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
              endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
              shiftTimeId: this.shiftForm.value.shiftTimeId,
              fuelTerminalsId: this.shiftForm.value.terminalId
            };
            this.post.getPosDetailsPOST(data).subscribe((res) => {
              if (res.status == 'OK') {
                this.posDetails = res.data;
                if (res.data.length) {
                  // this.spinner.show();
                  this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                    const dataJSON = {
                      openDate: '',
                      shift: '',
                      name: '',
                      pos: '',
                      paytmTotalAmount: 0,
                      details: '',
                    };
                    dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                    dataJSON.name = shift.firstName + ' ' + shift.lastName;
                    dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                    dataJSON.pos = shift.terminalName;
                    dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                    dataJSON.details = shift.transacId;

                    this.posData.push(dataJSON);
                    this.spinner.hide();
                    this.cd.detectChanges()

                  })
                } else {
                  alert("Data Not found..")
                  this.getPosDetails(this.fuelDealerId);
                  this.shiftForm.controls["terminalId"].setValue("")
                  this.shiftForm.controls["shiftTimeId"].setValue("")
                  this.spinner.hide();
                  this.cd.detectChanges()

                }

              } else {
                this.spinner.hide();
                this.cd.detectChanges()
              }
            });
          } else {
            if (this.shiftForm.value.operatorStaffId && this.shiftForm.value.terminalId) {
              this.spinner.show();

              this.posData.length = 0;
              const data = {
                fuelDealerId: this.fuelDealerId,
                startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                fuelDealerStaffId: this.shiftForm.value.operatorStaffId,
                fuelTerminalsId: this.shiftForm.value.terminalId
              };
              this.post.getPosDetailsPOST(data).subscribe((res) => {
                if (res.status == 'OK') {
                  this.posDetails = res.data;
                  if (res.data.length) {
                    // this.spinner.show();
                    this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                      const dataJSON = {
                        openDate: '',
                        shift: '',
                        name: '',
                        pos: '',
                        paytmTotalAmount: 0,
                        details: '',
                      };
                      dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                      dataJSON.name = shift.firstName + ' ' + shift.lastName;
                      dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                      dataJSON.pos = shift.terminalName;
                      dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                      dataJSON.details = shift.transacId;

                      this.posData.push(dataJSON);
                      this.spinner.hide();
                      this.cd.detectChanges()

                    })
                  } else {
                    alert("Data Not found..")
                    this.getPosDetails(this.fuelDealerId);
                    this.shiftForm.controls["terminalId"].setValue("")
                    this.shiftForm.controls["operatorStaffId"].setValue("")
                    this.spinner.hide();
                    this.cd.detectChanges()

                  }

                } else {
                  this.spinner.hide();
                  this.cd.detectChanges()
                }
              });
            } else {
              if (this.shiftForm.value.operatorStaffId) {
                this.spinner.show();

                this.posData.length = 0;
                const data = {
                  fuelDealerId: this.fuelDealerId,
                  startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                  endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                  fuelDealerStaffId: this.shiftForm.value.operatorStaffId,
                };
                this.post.getPosDetailsPOST(data).subscribe((res) => {
                  if (res.status == 'OK') {
                    this.posDetails = res.data;
                    if (res.data.length) {
                      // this.spinner.show();
                      this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                        const dataJSON = {
                          openDate: '',
                          shift: '',
                          name: '',
                          pos: '',
                          paytmTotalAmount: 0,
                          details: '',
                        };
                        dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                        dataJSON.name = shift.firstName + ' ' + shift.lastName;
                        dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                        dataJSON.pos = shift.terminalName;
                        dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                        dataJSON.details = shift.transacId;

                        this.posData.push(dataJSON);
                        this.spinner.hide();
                        this.cd.detectChanges()

                      })
                    } else {
                      alert("Data Not found..")
                      this.getPosDetails(this.fuelDealerId);
                      this.shiftForm.controls["operatorStaffId"].setValue("")
                      this.spinner.hide();
                      this.cd.detectChanges()


                    }

                  } else {
                    this.spinner.hide();
                    this.cd.detectChanges()
                  }
                });
              } else {
                if (this.shiftForm.value.shiftTimeId) {
                  this.spinner.show();

                  this.posData.length = 0;
                  const data = {
                    fuelDealerId: this.fuelDealerId,
                    startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                    endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                    shiftTimeId: this.shiftForm.value.shiftTimeId,
                  };
                  this.post.getPosDetailsPOST(data).subscribe((res) => {
                    if (res.status == 'OK') {
                      this.posDetails = res.data;
                      if (res.data.length) {
                        // this.spinner.show();
                        this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                          const dataJSON = {
                            openDate: '',
                            shift: '',
                            name: '',
                            pos: '',
                            paytmTotalAmount: 0,
                            details: '',
                          };
                          dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                          dataJSON.name = shift.firstName + ' ' + shift.lastName;
                          dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                          dataJSON.pos = shift.terminalName;
                          dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                          dataJSON.details = shift.transacId;

                          this.posData.push(dataJSON);
                          this.spinner.hide();
                          this.cd.detectChanges()

                        })
                      } else {
                        alert("Data Not found..")
                        this.getPosDetails(this.fuelDealerId);
                        this.shiftForm.controls["shiftTimeId"].setValue("")
                        this.spinner.hide();
                        this.cd.detectChanges()


                      }

                    } else {
                      this.spinner.hide();
                      this.cd.detectChanges()

                    }
                  });
                } else {
                  if (this.shiftForm.value.terminalId) {
                    this.spinner.show();

                    this.posData.length = 0;
                    const data = {
                      fuelDealerId: this.fuelDealerId,
                      startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                      endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
                      fuelTerminalsId: this.shiftForm.value.terminalId,
                    };
                    this.post.getPosDetailsPOST(data).subscribe((res) => {
                      if (res.status == 'OK') {
                        this.posDetails = res.data;
                        if (res.data.length) {
                          // this.spinner.show();
                          this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
                            const dataJSON = {
                              openDate: '',
                              shift: '',
                              name: '',
                              pos: '',
                              paytmTotalAmount: 0,
                              details: '',
                            };
                            dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                            dataJSON.name = shift.firstName + ' ' + shift.lastName;
                            dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
                            dataJSON.pos = shift.terminalName;
                            dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
                            dataJSON.details = shift.transacId;
                            this.posData.push(dataJSON);
                            this.spinner.hide();

                          })
                        } else {
                          alert("Data Not found..")
                          this.getPosDetails(this.fuelDealerId);
                          this.shiftForm.controls["terminalId"].setValue("")
                          this.spinner.hide();
                          this.cd.detectChanges()

                        }

                      } else {
                        this.spinner.hide();
                        this.cd.detectChanges()
                      }
                    });
                  } else {
                    this.getPosDetails(this.fuelDealerId);
                    this.spinner.hide();
                    this.cd.detectChanges()
                  }

                }
              }
            }
          }
        }
      }
    } else {
      alert("Please Select Date..!")
      this.spinner.hide();
      this.cd.detectChanges()
    }
  }
  
  getPosDetails(fuelDealerId: any) {
    this.spinner.show()
    this.posData.length = 0;
    const data = {
      fuelDealerId: fuelDealerId,
      startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    };
    this.post.getPosDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.posDetails = res.data;

        this.posDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; terminalName: string; paytmTotalAmount: number; transacId: string; }) => {
          const dataJSON = {
            openDate: '',
            shift: '',
            name: '',
            pos: '',
            paytmTotalAmount: 0,
            details: '',

          };

          dataJSON.openDate = moment(shift.openDate).format("YYYY-MM-DD");
          dataJSON.name = shift.firstName + ' ' + shift.lastName;
          dataJSON.shift = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
          dataJSON.pos = shift.terminalName;
          dataJSON.paytmTotalAmount = shift.paytmTotalAmount;
          dataJSON.details = shift.transacId;

          this.posData.push(dataJSON);
          this.spinner.hide();
          this.cd.detectChanges()

        })

      } else {
        this.spinner.hide();
        this.cd.detectChanges()

      }
    });
  }

  getShiftDetails(fuelDealerId: any) {
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }
    this.post.getShiftTimeDetailPOST(data)
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
    this.post1.getAllAttendantsByDidPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.staffDetails = res.data;
        this.cd.detectChanges()
      } else {
      }
    });
  }
  
  getPosTerminals(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getPosTerminalPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.terminalDetails = res.data;
        this.cd.detectChanges()
      } else {
      }
    });
  }
  
  exportToPDF() { 
    var cols = [["Date", "Shift", "Operator_Name","Digital_POS", "Details","Amount"]];
    var rows = [];
    for (var key in this.posData) { 
    
       var temp = [
        moment(this.posData[key].openDate).format("DD-MM-YYYY"),
        this.posData[key].shift,
        this.posData[key].name,
        this.posData[key].pos,
        this.posData[key].details,
        Number(this.posData[key].paytmTotalAmount).toFixed(2), 
        ];
        rows.push(temp);
    }
  
    var doc = new jsPDF('l', 'pt');
  
    doc.setFontSize(12);
    doc.text("POSDetails",350, 35 );
   
  
     autoTable(doc, {
      columnStyles: {
       0: {cellWidth: 110},     
       1: {cellWidth: 110},   
       2: {cellWidth: 150},     
       3: {cellWidth: 150},    
       4: {cellWidth: 110},     
       5: {cellWidth: 110},      
 
      },
 
      margin: {top: 80},
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
  });
   
    doc.save("POSDetails.pdf");
  
    }

  exportExcel(): void {
    this.posDataExcel = []
    this.posData.map((res1: { openDate: moment.MomentInput; shift: string; name: string; pos: string; details: string; paytmTotalAmount: any; }) => {
      const dataJson = {
        Date: '',
        Shift: '',
        Operator_Name: '',
        Digital_POS: '',
        Details: '',
        Amount: '',


      };

      dataJson.Date = moment(res1.openDate).format("DD-MM-YYYY");
      dataJson.Shift = res1.shift;
      dataJson.Operator_Name = res1.name;
      dataJson.Digital_POS = res1.pos;
      dataJson.Details = res1.details;
      dataJson.Amount = Number(res1.paytmTotalAmount).toFixed(2);

      this.posDataExcel.push(dataJson);

    })
    this.excelService.exportAsExcelFile(
      this.posDataExcel,
      "POSDetails"
    );

  }

}
