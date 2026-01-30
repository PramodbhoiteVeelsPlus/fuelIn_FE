import { ChangeDetectorRef, Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { BaseTablesService } from '../base-tables.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal2Component } from 'src/app/_metronic/partials/layout/modals/modal2/modal2.component';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-base-tables-widget13',
  templateUrl: './base-tables-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget13Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;

  p: number = 1;
  p1: number = 1;
  total: number = 0;
  staffDetailsStaff: any = [];
  designation: any;
  accessGroupId: any;
  liteMangerLimit: boolean = false;
  fuelDealerStaffIdUpdate: any;
  userIdUpdate: any;
  personIdUpdate: any;
  firstName: any;
  lastName: any;
  salary: any;
  modalReference1: any;
  closeResult: string;
  accessGroupIdUpdate: string;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modal2Component: Modal2Component;

  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    this.staffDetailsStaff = JSON.parse(localStorage.getItem('staffDetailsStaff') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    if (!this.staffDetailsStaff.length) {
      this.getStaffDetails(this.fuelDealerId)
    } else {
      this.getStaffDetails1(this.fuelDealerId)
    }
    this.getStaffDetails(this.fuelDealerId)
  }


  getStaffDetails(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getStaffDetailsPOST(data)
      .subscribe(res => {
        if (res) {
          this.staffDetailsStaff = res.data
          this.designation = res.data[0].designation;
          if (this.accessGroupId == 19 && res.data.length == 2) {
            this.liteMangerLimit = true;
          }
          
          localStorage.setItem('staffDetailsStaff', JSON.stringify(this.staffDetailsStaff));
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          localStorage.setItem('staffDetailsStaff', JSON.stringify([]));
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  getStaffDetails1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getStaffDetailsPOST(data)
      .subscribe(res => {
        if (res) {
          this.staffDetailsStaff = res.data
          this.designation = res.data[0].designation;
          if (this.accessGroupId == 19 && res.data.length == 2) {
            this.liteMangerLimit = true;
          }
          localStorage.setItem('staffDetailsStaff', JSON.stringify(this.staffDetailsStaff));
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          localStorage.setItem('staffDetailsStaff', JSON.stringify([]));
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getStaffDetails(this.fuelDealerId);
  }

  noUpdateMapp(status: any, fuelDealerStaffId: any, dealerMapStatus: string) {
    if (dealerMapStatus != "MAPPED") {
      if (status.target.checked) {
        // console.log(status.target.checked);
        // console.log(fuelDealerStaffId);
        alert("Error to Update Mapping!")
        this.getStaffDetails(this.fuelDealerId)
        this.cd.detectChanges()
      }
    }
    else {
      alert("Error to Update Mapping!")
      this.getStaffDetails(this.fuelDealerId)
      this.cd.detectChanges()
    }
  }

  async openModal() {
    return await this.modal2Component.open();
  }

  updateMapping(status: any, fuelDealerStaffId: any, dealerMapStatus: string, phone: any) {

    this.spinner.show()
    if (dealerMapStatus != "MAPPED") {
      if (status.target.checked) {
        //  console.log(status.target.checked);
        //  console.log(fuelDealerStaffId);
        dealerMapStatus = "MAPPED";
        let data = {
          dealerMapStatus: dealerMapStatus,
          fuelDealerStaffId: fuelDealerStaffId,
          phone: phone
        }
        this.post.updateMapStatusforStaffPOST(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.spinner.hide();
              this.getStaffDetails(this.fuelDealerId)
            }
            else {
              alert("Error to Update Mapping!")
              this.spinner.hide();
              this.getStaffDetails(this.fuelDealerId)
            }
          })
      }
    } else {
      dealerMapStatus = "UNMAPPED";

      let data = {
        dealerMapStatus: dealerMapStatus,
        fuelDealerStaffId: fuelDealerStaffId,
        fuelDealerId: this.fuelDealerId,
        phone: phone
      }
      this.post.updateMapStatusforStaffPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Mapping Status Updated to UNMAPPED!")
            this.getStaffDetails(this.fuelDealerId)
            this.spinner.hide();
          }
          else {
            alert("Error to Update Mapping!")
            this.spinner.hide();
            this.getStaffDetails(this.fuelDealerId)
          }
        })
    }
  }

  staffEdit(updateStaff: any, fuelDealerStaffId: any, userId: any, personId: any, firstName: any, lastName: any, designation: any, salary: any) {

    this.fuelDealerStaffIdUpdate = fuelDealerStaffId,
      this.userIdUpdate = userId,
      this.personIdUpdate = personId,
      this.firstName = firstName,
      this.lastName = lastName,
      this.designation = designation
    this.salary = salary
    this.modalReference1 = this.modalService.open(updateStaff, { size: 'lg' });

    this.modalReference1.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  UpdateDealerStaffDetails() {
    if (this.firstName && this.lastName) {

      if (this.designation == 'OPERATOR') {
        this.accessGroupIdUpdate = '13'
      }
      if (this.designation == 'MANAGER' && this.accessGroupId == '12') {
        this.accessGroupIdUpdate = '14'
      }
      if (this.designation == 'MANAGER' && this.accessGroupId == '19') {
        this.accessGroupIdUpdate = '21'
      }

      let data = {
        fuelDealerStaffId: this.fuelDealerStaffIdUpdate,
        userId: this.userIdUpdate,
        personId: this.personIdUpdate,
        firstName: this.firstName,
        lastName: this.lastName,
        designation: this.designation,
        accessGroupId: this.accessGroupIdUpdate,
        salary: this.salary,
      }
      this.post.UpdateDealerStaffDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Staff details update successfully!")
            this.modalReference1.close('close')
            // this.switchedToStaff(this.personIdUpdate,this.accessGroupIdUpdate)
            this.getStaffDetails(this.fuelDealerId);
          }
          else {
            this.spinner.hide();
            this.modalReference1.close('close')
            alert("Error to update staff details!")

          }
        })
    } else {
      alert("Please Enter Name")
    }
  }

  closeModalEditStaff() {
    this.modalReference1.close('close');
  }
}
