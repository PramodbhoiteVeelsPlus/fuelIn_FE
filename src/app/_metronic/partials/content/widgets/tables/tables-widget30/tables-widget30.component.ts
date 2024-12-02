import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelService } from 'src/app/pages/excel.service';
import { addVehicle } from '../../stats/stats-widget17/addVehicle.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-tables-widget30',
  templateUrl: './tables-widget30.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget30Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  
  addVehicleForm = new FormGroup({
    selectedCorp: new FormControl(''),
    addVehicleDate: new FormControl('', Validators.required),
    vehicleNumber: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)
  });

  dealerLoginVPId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  mappingAccData: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  gst: any;
  mappingAccDataExcel: any = [];
  email: any;
  headerName2: any;
  headerName1: any;
  headerName3: any;
  mappingAccSearchData: any = [];
  searchData: any;
  previousOutstandExpand: any;
  show: boolean = false;
  maxCreditAmountExpand: any;
  creditDayLimitExpand: any;
  manualNumberStartExpand: any;
  manualNumberEndExpand: any;
  fuelDealerCustomerMapIdExpand: any;
  rowNumber: any;
  customerNameVehicle: string;
  modalVehicleData: any;
  modalRef2: any;
  closeResult: string;
  updateId: any;
  updateCompanyName: any;
  updatePersonName: any;
  mappingAddress1: any;
  mappingAddress2: any;
  mappingCity: any;
  updateGST: string;
  updateMail: string;
  updateMaxCRLimit: any;
  creditDayLimit: any;
  modalUpdateName: any;
  previousOutstandForModal: any;
  pendingOutstanding: any;
  companyNameOust: any;
  billingForm: any;
  fuelDealerCustomerMapId: any;
  manualNumberStart: any;
  manualNumberEnd: any;
  companyNameManual: any;
  companyNameRemark: any;
  flagCorporateId: any;
  idcorporateFlag: any;
  mappingApproveDate = new Date();
  off: boolean = false;
  isDisableSMS: any;
  corporateInDetails: any = [];
  corporateInDetailsLength: any = [];
  isDisableEmail: any;
  corporateFlagPurpose: any;
  flagStatus: string;
  corporateReviewFlagUpdate: string;
  corporateFlagPurposeUpdate: string;
  dealerCorporateId: any;
  companyNameAddVehicle: any;
  fuelDealerCorpMapIdNew: any;
  customerCorporateId: any;
  countAdvance: any = 1;
  addVehicleData: any = [];
  count: number = 1;
  addVehicle = new addVehicle();

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = dealerData.fuelDealerId;
    this.dealerCorporateId = dealerData.corporateId;
    this.headerName1 = dealerData.companyName;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    // this.getCorporateById(this.dealerLoginVPId);
    // this.addVehicleForCr()
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  // get Corporate DetailsBy VP-Id
  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.headerName1 = res.data[0].companyName;
            this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
            this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getMappingAccount(this.fuelDealerId);
          // this.getFuelPriceByProductDateDealer(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getMappingAccount(this.fuelDealerId);
  }

  getMappingAccount(fuelDealerId: any) {
    this.spinner.show();
    this.mappingAccData = []
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getMappingAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.mappingAccData = res.data;
          this.mappingAccSearchData = res.data;
          console.log("data", this.mappingAccData)
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.mappingAccData = [];
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  allCustomerPDFDownload() {

    // "Pending days",
    var cols = [["Mapped date", "Customer name", "Key person Name", "Key person mobile", "GST", "CRLimit", "CRDayLimit"]];
    var rows = [];
    for (var key in this.mappingAccData) {

      if (this.mappingAccData[key].mappingGST != 'undefined') {
        this.gst = this.mappingAccData[key].mappingGST
      } else {
        this.gst = ''
      }
      var temp = [
        moment(this.mappingAccData[key].mappingCreatedDate).format("DD-MM-YYYY"),
        this.mappingAccData[key].companyName,
        this.mappingAccData[key].hostName,
        this.mappingAccData[key].hostPhone,
        this.gst,
        this.mappingAccData[key].maxCreditAmount,
        this.mappingAccData[key].creditDayLimit,

      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');


    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("All Credit Customers", 350, 35);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 150 },
        2: { cellWidth: 150 },
        3: { cellWidth: 100 },
        4: { cellWidth: 110 },
        5: { cellWidth: 90 },
        6: { cellWidth: 70 },
      },

      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });

    doc.save("AllCustomers.pdf");


  }


  allCustomerExcelDownload() {
    this.mappingAccDataExcel = []
    this.mappingAccData.map((res: { mappingEmail: string; mappingGST: string; mappingCreatedDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; maxCreditAmount: any; creditDayLimit: any; }) => {
      if (res.mappingEmail != 'undefined') {
        this.email = res.mappingEmail
      } else {
        this.email = ''
      }
      if (res.mappingGST != 'undefined') {
        this.gst = res.mappingGST
      } else {
        this.gst = ''
      }
      let json = {
        mappedDate: moment(res.mappingCreatedDate).format("DD-MM-YYYY"),
        CustomerName: res.companyName,
        KeyPersonName: res.hostName,
        KeyPersonMobile: res.hostPhone,
        Email: this.email,
        GST: this.gst,
        CrLimit: res.maxCreditAmount,
        CrDayLimit: res.creditDayLimit,
      };
      this.mappingAccDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(this.mappingAccDataExcel, "All Customers");
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.mappingAccData = this.mappingAccSearchData.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
  }

  changeValue(i: any, previousOutstand: any, maxCreditAmount: any, creditDayLimit: any, manualNumberStart: any, manualNumberEnd: any, fuelDealerCustomerMapId: any, mappingStatus: any) {

    this.previousOutstandExpand = ''
    this.maxCreditAmountExpand = ''
    this.creditDayLimitExpand = ''
    this.manualNumberStartExpand = ''
    this.manualNumberEndExpand = ''
    this.fuelDealerCustomerMapIdExpand = ''

    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.previousOutstandExpand = previousOutstand
        this.maxCreditAmountExpand = maxCreditAmount
        this.creditDayLimitExpand = creditDayLimit
        this.manualNumberStartExpand = manualNumberStart
        this.manualNumberEndExpand = manualNumberEnd
        this.fuelDealerCustomerMapIdExpand = fuelDealerCustomerMapId
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.previousOutstandExpand = previousOutstand
      this.maxCreditAmountExpand = maxCreditAmount
      this.creditDayLimitExpand = creditDayLimit
      this.manualNumberStartExpand = manualNumberStart
      this.manualNumberEndExpand = manualNumberEnd
      this.fuelDealerCustomerMapIdExpand = fuelDealerCustomerMapId
    }
  }

  getVehicleByCustMapId(viewVehicle: any, fuelDealerCustomerMapId: any, companyName: any) {
    this.customerNameVehicle = ''
    this.customerNameVehicle = companyName;
    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomerMapId
    }

    this.post.getfuelCreditVehicleByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.modalVehicleData = res.data
          this.modalRef2 = this.modalService.open(viewVehicle);
          this.modalRef2.result.then(
            (result: any) => {
              this.closeResult = `Closed with: ${result}`;
            },
            (reason: any) => {
              this.closeResult = `Dismissed`;
            });
        }
      })
  }

  updateName(editName: any, fuelDealerCustomerMapId: any, companyName: any, mappingCustomerName: any, GSTNumber: string, mappingEmail: string, maxCreditAmount: any, creditDayLimit: any, mappingAddress1: any, mappingAddress2: any, mappingCity: any) {

    this.updateId = fuelDealerCustomerMapId
    this.updateCompanyName = companyName
    this.updatePersonName = mappingCustomerName
    this.mappingAddress1 = mappingAddress1
    this.mappingAddress2 = mappingAddress2
    this.mappingCity = mappingCity
    if (GSTNumber != 'undefined') {
      this.updateGST = GSTNumber
    } else {
      this.updateGST = ''
    }
    if (mappingEmail != 'undefined') {
      this.updateMail = mappingEmail
    } else {
      this.updateMail = ''
    }

    this.updateMaxCRLimit = maxCreditAmount
    this.creditDayLimit = creditDayLimit

    this.modalUpdateName = this.modalService.open(editName)
    this.modalUpdateName.result.then((result: any) => {
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

  checkOutstandingInSavedStatement(previousOut: any, fuelDealerCustomerMapId: any, previousOutstand: any, companyName: any) {
    this.spinner.show();
    let data = {
      customerMapId: fuelDealerCustomerMapId,
    };

    this.post.checkCustomerPreviousOutstandingIsAddedOrNotPOST(data)
      .subscribe(res => {

        if (res.data.length) {
          if (confirm("Using this outstanding you saved a statement. If you update your customer outstanding then your saved statement will be changed. Do you want to update your customer outstanding? ")) {

            this.spinner.hide();
            this.openPreOutstand(previousOut, fuelDealerCustomerMapId, previousOutstand, companyName)
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.openPreOutstand(previousOut, fuelDealerCustomerMapId, previousOutstand, companyName)

        }
      })

  }

  openPreOutstand(openDate: any, fuelDealerCustomerMapId: any, previousOutstand: any, companyName: any) {
    this.previousOutstandForModal = previousOutstand;
    this.pendingOutstanding = previousOutstand;
    this.companyNameOust = companyName
    this.modalRef2 = this.modalService.open(openDate, { size: 'sm' });
    this.billingForm.controls['fuelDealerCustomerMapIdForBilling'].setValue(fuelDealerCustomerMapId);
    this.modalRef2.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      });
  }

  openManualNo(manualNo: any, fuelDealerCustomerMapId: any, manualNumberStart: any, manualNumberEnd: any, companyName: any) {
    this.fuelDealerCustomerMapId = fuelDealerCustomerMapId;
    this.manualNumberStart = manualNumberStart
    this.manualNumberEnd = manualNumberEnd
    this.companyNameManual = companyName

    this.modalRef2 = this.modalService.open(manualNo);
    this.modalRef2.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      });
  }

  updateCorporateReview(updateFlag: any, corporateId: any, companyName: any) {

    this.companyNameRemark = companyName
    this.flagCorporateId = corporateId

    this.modalUpdateName = this.modalService.open(updateFlag)
    this.modalUpdateName.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateCorporateFlag(updateFlagCorp: any, idcorporateFlag: any, companyName: any) {
    this.companyNameRemark = companyName
    this.idcorporateFlag = idcorporateFlag;

    this.modalUpdateName = this.modalService.open(updateFlagCorp)
    this.modalUpdateName.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateMapping(status: any, fuelDealerCustomerMapId: any, mappingStatus: string) {
    if (mappingStatus == "INACTIVE") {
      if (status.target.checked) {
        mappingStatus = "ACTIVE";

        let data = {
          mappingStatus: mappingStatus,
          fuelDealerCustomerMapId: fuelDealerCustomerMapId,
          mapApproveDate: this.mappingApproveDate
        }

        this.post.updateCustDealerReqPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Mapping Status Updated to Active!")
              this.getMappingAccount(this.fuelDealerId);
            }
            else {
              alert("Error to Update Mapping!")
            }

          })
      }
    } else {
      mappingStatus = "INACTIVE";

      let data = {
        mappingStatus: mappingStatus,
        fuelDealerCustomerMapId: fuelDealerCustomerMapId,
        mapApproveDate: this.mappingApproveDate
      }

      this.post.updateCustDealerReqPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Mapping Status Updated to Inactive!")
            this.getMappingAccount(this.fuelDealerId);
          }

          else {
            alert("Error to Update Mapping!")
          }

        })
    }

  }
  updateSms(fuelDealerCustomerMapId: any, mappingStatus: string) {
    if (mappingStatus == "TRUE") {
      mappingStatus = "FALSE";

      let data = {
        smsStatus: mappingStatus,
        fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      }
      this.post.updateMappingSmsStatusPOST(data)
        .subscribe(res => {
          if (res) {

            alert("SMS service has been DEACTIVATED for this customer, now transaction SMS will NOT be send to this customer..")

            this.getMappingAccount(this.fuelDealerId);
          }
          else {
            alert("Error to Update Mapping!")
          }

        })

    } else if (mappingStatus == "FALSE") {
      mappingStatus = "TRUE";

      let data = {
        smsStatus: mappingStatus,
        fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      }

      this.post.updateMappingSmsStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("SMS service has been ACTIVATED for this customer, now transaction SMS will be send to this customer..")

            this.getMappingAccount(this.fuelDealerId);
          }
          else {
            alert("Error to Update Mapping!")
          }

        })
    } else {
      this.getCorporateReqByDealerId();
      this.getMappingAccount(this.fuelDealerId);
    }
  }

  getCorporateReqByDealerId() {
    let data = {
      dealerId: this.fuelDealerId,
    }

    this.post.getCorporateRequestByDealerPOST(data)
      .subscribe(res => {
        if (res) {
          this.corporateInDetails = res;
          this.corporateInDetailsLength = res.data;
        }
        else {
          alert("Error to Show Corporate List!")
        }
      })
  }

  smsAlert() {
    alert("Contact ADMIN for Activation of SMS service..!")
  }

  updateEmail(fuelDealerCustomerMapId: any, mappingStatus: string) {
    if (mappingStatus == "TRUE") {

      mappingStatus = "FALSE";

      let data = {
        emailStatus: mappingStatus,
        fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      }

      this.post.updateMappingEmailStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Email service has been DEACTIVATED for this customer, now transaction emails will NOT be send to this customer..")

            this.getMappingAccount(this.fuelDealerId);
          }
          else {
            alert("Error to Update Mapping!")
          }
        })

    } else if (mappingStatus == "FALSE") {
      mappingStatus = "TRUE";

      let data = {
        emailStatus: mappingStatus,
        fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      }

      this.post.updateMappingEmailStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Email service has been ACTIVATED for this customer, now transaction emails will be send to this customer..")

            this.getMappingAccount(this.fuelDealerId);
          }
          else {
            alert("Error to Update Mapping!")
          }

        })
    } else {

      this.getMappingAccount(this.fuelDealerId);
    }
  }

  emailAlert() {
    alert("Contact ADMIN for Activation of Email service..!")
  }

  removeVehiclefromCustomerMapId(idfuelCreditVehicle: any) {
    let data = {
      idfuelCreditVehicle: idfuelCreditVehicle
    }
    this.post.RemovefuelCreditVehicleByIdfuelCreditVehiclePOST(data)
      .subscribe(res => {
        alert(res.msg)
        this.getMappingAccount(this.fuelDealerId)
        this.modalRef2.close('close')

      })
  }

  updateNameByMapId() {
    if (this.updateCompanyName && this.updatePersonName) {
      if (this.updateMaxCRLimit) {
        let data = {
          mappingCompanyName: this.updateCompanyName,
          mappingCustomerName: this.updatePersonName,
          Id: this.updateId,
          gstNumber: this.updateGST,
          email: this.updateMail,
          crLimit: this.updateMaxCRLimit,
          creditDayLimit: this.creditDayLimit,
          mappingAddress1: this.mappingAddress1,
          mappingAddress2: this.mappingAddress2,
          mappingCity: this.mappingCity,
        }
        this.post.updateMappingCompanyNamePost(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Update Successfully..")
              this.getMappingAccount(this.fuelDealerId);
              this.closeModalUpdate()
            }
            else {
              alert("Error to Update !")
            }

          })
      } else {
        alert("Please Enter Credit Limit..")
      }
    } else {
      alert("Please Enter Name..")
    }
  }

  closeModalUpdate() {
    this.modalUpdateName.close('close')
    this.updateId = ''
    this.updateCompanyName = ''
    this.updatePersonName = ''
    this.updateGST = ''
    this.updateMail = ''
    this.updateMaxCRLimit = ''
  }

  addOutstandAmount() {
    this.spinner.show();
    let createDate = new Date();
    const data = {
      fuelDealerCustomerMapId: this.billingForm.value.fuelDealerCustomerMapIdForBilling,
      pendingOutstanding: this.pendingOutstanding,
      previousOutstandForManage: this.previousOutstandForModal,
      createdDateTime: moment(createDate).format('YYYY-MM-DD hh:mm:ss')
    };
    this.post.updatePreviousOutstandingPOST(data)
      .subscribe((res) => {
        if (res) {
          alert("Outstanding Added Successfully..!")
          this.modalRef2.close('close');
          this.spinner.hide();
          this.pendingOutstanding = 0;
          this.getMappingAccount(this.fuelDealerId);
        }
        else {
          this.spinner.hide();
        }
      });
  }

  checkManualNumRange() {
    if (this.manualNumberStart < this.manualNumberEnd) {
      let data = {
        fuelDealerId: this.fuelDealerId,
        manualNumberStart: this.manualNumberStart,
        manualNumberEnd: this.manualNumberEnd
      }
      this.post.checkManualNumRangePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            alert("This range is alrady in used.. please change the range..")
          } else {
            this.updateManualNumber()
          }
        })
    } else {
      alert("please enter valid range")
    }
  }

  updateManualNumber() {
    let data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
      manualNumberStart: this.manualNumberStart,
      manualNumberEnd: this.manualNumberEnd
    }
    this.post.updateManualNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.getMappingAccount(this.fuelDealerId);
          this.modalRef2.close('close')
        }
      })
  }
  addFlagForCorp() {
    if (this.corporateFlagPurpose) {
      let data = {
        corporateFlagDealerId: this.fuelDealerId,
        corporateReviewFlag: "TRUE",
        corporateFlagPurpose: this.corporateFlagPurpose,
        corporateIdForFlag: this.flagCorporateId
      }
      this.post.addFlagForCorpPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert(res.msg)
            this.getMappingAccount(this.fuelDealerId);
            this.modalUpdateName.close('close')
            this.flagStatus = ''
            this.corporateFlagPurpose = ''
          }
          else {
            alert("Error to Update !")
          }

        })
    } else {
      alert("Please Enter Status OR Reason")
    }
  }
  updateFlagForCorp() {
    if (this.idcorporateFlag) {
      let data = {
        idcorporateFlag: this.idcorporateFlag,
      }
      this.post.updateFlagForCorpPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert(res.msg)
            this.getMappingAccount(this.fuelDealerId);
            this.modalUpdateName.close('close')
            this.corporateReviewFlagUpdate = ''
            this.corporateFlagPurposeUpdate = ''

          }
          else {
            alert("Error to Update !")
          }

        })
    } else {
      alert("Please Enter Status OR Reason")
    }
  }
  
openVehicle(addVehicle: any,fuelDealerCustomerMapId: any,fuelCorporateId: any,companyName: any){
  this.companyNameAddVehicle = companyName
  this.fuelDealerCorpMapIdNew = fuelDealerCustomerMapId;
  this.customerCorporateId = fuelCorporateId
  this.modalRef2 = this.modalService.open(addVehicle);
  this.addVehicleForCr()
  this.cd.detectChanges()
  this.modalRef2.result.then(
    (result: any) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason: any) => {
      this.closeResult = `Dismissed`;
    });
}

addVehicleForCr() {
  this.countAdvance = this.countAdvance + 1;
  if (this.countAdvance < 12) {
    this.addVehicle = new addVehicle();
    this.addVehicleData.push(this.addVehicle);
    this.cd.detectChanges()
  }
  else {
    this.count = 11;
    alert("Please save 10 credit entries")
    this.cd.detectChanges()
  }

}

setVehicleNumber() {
    this.addVehicleForm.controls["vehicleNumber"].setValue(this.addVehicle.vehicleNumber)
    this.checkFuelCreditVehicle();
  }

  checkFuelCreditVehicle(){
    let data ={
      fuelDealerCustomerMapId:this.fuelDealerCorpMapIdNew,
      dealerId:this.fuelDealerId,
      vehicleNumber:this.addVehicleForm.value.vehicleNumber
    }
  
  this.post.checkVehicleByfuelDealerIdPOST(data)
  .subscribe(res=>{
    if(res.status =="OK"){
      if (res.data.length) {
         alert(res.msg)
        }

      }
     })
  }
  
  removeVehicle(i: number) {
    this.addVehicleData.splice(i, 1);
    this.count = this.count - 1;
  }
  
  addFuelCreditVehicle(){
    if(this.fuelDealerCorpMapIdNew){
    let createdDate = new Date
          let data ={
            addVehicleData: this.addVehicleData,
            fuelDealerCustomerMapId:this.fuelDealerCorpMapIdNew,
            dealerId:this.fuelDealerId,
            dealerCorporateId:this.dealerCorporateId,
            customerCorporateId:this.customerCorporateId,
            createdAt:createdDate,
            createdBy:this.fuelDealerId,
          }
    
        
        this.post.addFuelVehicleDetailsPOST(data)
        .subscribe(res=>{
         
          alert(res.msg)
          this.addVehicleData = [];
          this.countAdvance = 1;
          this.addVehicleForCr();
          this.getMappingAccount(this.fuelDealerId);
          this.modalRef2.close('close')
    
    
        })}
        else{
          alert("Please Select Customer..")
        }
    
      }
}
