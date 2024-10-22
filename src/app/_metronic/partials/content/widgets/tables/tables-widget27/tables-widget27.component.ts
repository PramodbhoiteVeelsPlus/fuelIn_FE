import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { WidgetService } from '../../widgets.services';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  selector: 'app-tables-widget27',
  templateUrl: './tables-widget27.component.html',
  styleUrl: './tables-widget27.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget27Component {
  veelsPlusPersonId: any;

  filterForm = new FormGroup({
    dealerId: new FormControl(""),
    status: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  })
  
  referForm = new FormGroup({
    date: new FormControl(""),
    details: new FormControl(""),
  })

  dealerList: any = [];
  allDealerList: any = [];
  fuelDealerId: string;
  referralData: any = [];
  referralDataExcel: any = [];
  role: string;
  updateReferralId: any;
  updatestatus: any;
  remark: any;
  modalRef: any;
  closeResult: string;
  referralId: any;
  modalReference: any;
  closeResult1: string;
  referDetails: any = [];
  referralDetailsId: any;
  details: any;
  modalReference1: any;
  closeResult2: string;
  refDetails: any = [];
  refDetailsExcel: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  
  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.filterForm.controls["status"].setValue("")
    this.getAllDealerList();
    this.getReferrals()
    this.getAllRefDetails()
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getReferrals();
  }

  //getAllDealerList
  getAllDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getAllDealersListPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allDealerList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }
  
  getDealerId(id: any) {

    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.cd.detectChanges();
        } else {
          this.fuelDealerId = '';
          this.cd.detectChanges();
        }
      });
  }
  
  getReferrals() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.fuelDealerId && this.filterForm.value.status) {
        this.spinner.show()
        let data = {
          dealerId: this.fuelDealerId,
          status: this.filterForm.value.status,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else if (this.fuelDealerId) {
        this.spinner.show()
        let data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else if (this.filterForm.value.status) {
        this.spinner.show()
        let data = {
          status: this.filterForm.value.status,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      }
    } else {
      if (this.fuelDealerId && this.filterForm.value.status) {
        this.spinner.show()
        let data = {
          dealerId: this.fuelDealerId,
          status: this.filterForm.value.status,
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else if (this.fuelDealerId) {
        this.spinner.show()
        let data = {
          dealerId: this.fuelDealerId,
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else if (this.filterForm.value.status) {
        this.spinner.show()
        let data = {
          status: this.filterForm.value.status,
        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      } else {
        this.spinner.show()
        let data = {

        }

        this.post.getReferralListPOST(data).subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.referralData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.referralData = [];
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
      }
    }
  }

  deleteReferral(referralId: any) {
    this.spinner.show()
    let data = {
      referralId: referralId
    }

    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteReferralPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.getReferrals()
          this.spinner.hide()
        } else {
          alert(res.msg)
          this.getReferrals()
          this.spinner.hide()
        }
      })
    } else {
      this.getReferrals()
      this.spinner.hide()
    }
  }

  updateReferralStatus() {

    this.spinner.show()
    let data = {
      referralId: this.updateReferralId,
      status: this.updatestatus,
      remark: this.remark
    }

    this.post.updateReferralStatusPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.clear()
        this.getReferrals()
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.clear()
        this.getReferrals()
        this.spinner.hide()
      }
    })
  }

  exportexcel(): void {
    this.referralDataExcel.length = 0

    this.referralData.map((res: { accessGroupId: string; FuelVeelsId: any; companyName: any; hostName: any; hostPhone: any; createdAt: moment.MomentInput; ownerName: any; mobileNumber: any; refCompanyName: any; referralStatus: any; }) => {

      if (res.accessGroupId == '12') {
        this.role = 'OWNER'
      } else if (res.accessGroupId == '13') {
        this.role = 'OPERATOR'
      } else if (res.accessGroupId == '14') {
        this.role = 'MANAGER'
      }

      let json = {
        Dealer_VFId: res.FuelVeelsId,
        Petrol_Pump: res.companyName,
        Dealer_Name: res.hostName,
        Role: this.role,
        Dealer_Number: res.hostPhone,
        Referral_Date_Time: moment(res.createdAt).format("DD-MMM-YYYY HH:MM a"),
        Owner_Name: res.ownerName,
        Mobile_Number: res.mobileNumber,
        Company_Name: res.refCompanyName,
        Status: res.referralStatus
      };

      this.referralDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.referralDataExcel,
      "Referral"
    );
  }

  exportToPDF() {
    var cols = [["Dealer_VFId", "Petrol_Pump", "Dealer_Name", "Role", "Dealer_Number", "Referral_Date_Time", "Owner_Name", "Mobile_Number", "Company_Name", "Status"]];
    var rows = [];
    for (var key in this.referralData) {

      if (this.referralData[key].accessGroupId == '12') {
        this.role = 'OWNER'
      } else if (this.referralData[key].accessGroupId == '13') {
        this.role = 'OPERATOR'
      } else if (this.referralData[key].accessGroupId == '14') {
        this.role = 'MANAGER'
      }

      var temp = [
        this.referralData[key].FuelVeelsId,
        this.referralData[key].companyName,
        this.referralData[key].hostName,
        this.role,
        this.referralData[key].hostPhone,
        moment(this.referralData[key].createdAt).format("DD-MMM-YYYY HH:MM a"),
        this.referralData[key].ownerName,
        this.referralData[key].mobileNumber,
        this.referralData[key].refCompanyName,
        this.referralData[key].referralStatus
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(10);
    doc.text('Referral', 350, 35);


    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 80 },
        2: { cellWidth: 80 },
        3: { cellWidth: 50 },
        5: { cellWidth: 80 },
        6: { cellWidth: 80 },
        7: { cellWidth: 80 },
        8: { cellWidth: 80 },
        9: { cellWidth: 80 },
        10: { cellWidth: 80 },

      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    // doc.output('dataurlnewwindow')
    doc.save("Referral.pdf");


  }

  openStatus(updateStatus: any, referralId: any, status: any, remark: any) {
    this.updateReferralId = referralId
    this.updatestatus = status
    this.remark = remark

    this.modalRef = this.modalService.open(updateStatus);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      });
  }

  clear() {
    this.modalRef.close('close');
    this.updateReferralId = '';
    this.updatestatus = '';
    this.remark = '';
  }

  openDetails(updateDetails: any, referralId: any) {
    this.referralId = referralId

    this.modalReference = this.modalService.open(updateDetails, { size: 'lg' });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult1 = `Closed with: ${result}`;
      },
      (reason: any) => {

        this.closeResult1 = `Dismissed`;
      });
    this.getReferralDetails()
  }

  addReferralDetails() {
    this.spinner.show()
    let data = {
      referralId: this.referralId,
      referralDetailsDate: moment(this.referForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      referralDetails: this.referForm.value.details
    }

    console.log("data", data)
    this.post.addReferralDetailsPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.getReferralDetails()
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.spinner.hide()
      }
    })
  }

  cancel() {
    this.modalReference.close('close');
    this.referForm.controls['date'].setValue(' ');
    this.referForm.controls['details'].setValue(' ');
  }

  getReferralDetails() {
    this.spinner.show()
    let data = {
      referralId: this.referralId
    }

    this.post.getReferralDetailsPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.referDetails = res.data;
        this.spinner.hide()
      } else {
        this.referDetails = [];
        this.spinner.hide()
      }
    })
  }

  openReferDetails(updateRefDetails: any, referralDetailsId: any, referralDetails: any) {
    this.referralDetailsId = referralDetailsId
    this.details = referralDetails
    // this.referralDetailsDate = referralDetailsDate

    this.modalReference1 = this.modalService.open(updateRefDetails, { size: 'lg' });
    this.modalReference1.result.then(
      (result: any) => {
        this.closeResult2 = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult2 = `Dismissed`;
      });
    // this.getReferralDetails()
  }

  deleteRefDetails(referralDetailsId: any) {
    this.spinner.show()
    let data = {
      referralDetailsId: referralDetailsId
    }

    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteReferralDetailsPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.getReferralDetails()
          this.spinner.hide()
        } else {
          alert(res.msg)
          this.getReferralDetails()
          this.spinner.hide()
        }
      })
    } else {
      this.getReferralDetails()
      this.spinner.hide()
    }
  }


  updateReferralDetails() {

    this.spinner.show()
    let data = {
      referralDetailsId: this.referralDetailsId,
      referralDetails: this.details,
      // referralDetailsDate: this.referralDetailsDate
    }

    this.post.updateReferralDetailsPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.cancel1()
        this.getReferralDetails()
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.cancel1()
        this.getReferralDetails()
        this.spinner.hide()
      }
    })
  }
  
  cancel1() {
    this.modalReference1.close('close');
    this.referForm.controls['date'].setValue(' ');
    this.referForm.controls['details'].setValue(' ');
  }

  getAllRefDetails(){
    this.spinner.show()
    let data = {

    }

    this.post.getAllReferralDetailsPOST(data).subscribe(res => {
      if(res.status == "OK"){
        this.refDetails = res.data;
        this.spinner.hide()
      } else{
        this.refDetails = [];
        this.spinner.hide()
      }
    })
  }

  exportExcel(): void {
    this.refDetailsExcel.length = 0

    this.refDetails.map((res: { accessGroupId: string; FuelVeelsId: any; companyName: any; hostName: any; hostPhone: any; createdAt: moment.MomentInput; ownerName: any; mobileNumber: any; refCompanyName: any; referralStatus: any; referralDetailsDate: moment.MomentInput; referralDetails: any; }) => {

      if (res.accessGroupId == '12') {
        this.role = 'OWNER'
      } else if (res.accessGroupId == '13') {
        this.role = 'OPERATOR'
      } else if (res.accessGroupId == '14') {
        this.role = 'MANAGER'
      }

      let json = {
        Dealer_VFId: res.FuelVeelsId,
        Petrol_Pump: res.companyName,
        Dealer_Name: res.hostName,
        Role: this.role,
        Dealer_Number: res.hostPhone,
        Referral_Date_Time: moment(res.createdAt).format("DD-MMM-YYYY HH:MM a"),
        Owner_Name: res.ownerName,
        Mobile_Number: res.mobileNumber,
        Company_Name: res.refCompanyName,
        Status: res.referralStatus,
        Details_Date: moment(res.referralDetailsDate).format("DD-MMM-YYYY"),
        Details: res.referralDetails
      };

      this.refDetailsExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.refDetailsExcel,
      "ReferralDetails"
    );
  }
}
