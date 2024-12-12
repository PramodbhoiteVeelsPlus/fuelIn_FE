import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
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
  selector: 'app-advance-tables-widget15',
  templateUrl: './advance-tables-widget15.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget15Component {

  lubeForm = new FormGroup({
    lubricantsName: new FormControl('', Validators.required),
    lubricantsHsnSacNumber: new FormControl('', Validators.required),
    lubricantsUnit: new FormControl('', Validators.required),
    lubricantsId: new FormControl('', Validators.required),

  });
  isFastagReg: boolean = false;
  phoneSearch: any;
  dateCode: any;
  monthCode: number;
  monthAlpha: string;
  yearCode: any;
  veelsPlusCorporateId: string;
  stateCode: string;
  veelsPlusBranchId: string;
  veelsUserTypePlusId: string;
  userRole: string = "2";
  businessTypeCode: string;
  veelsPlusCorporateID: any;
  personId: any;
  userId: any;
  addressId: any;
  dealerLoginVPId: any;
  customerIdforReg: any;
  kycId: any;
  corporateIdforReg: any;
  veelsplususerId: any;
  isNumberFound: boolean = false;
  searchedCorpId: any;
  ftcorpId: any;
  isActive: any;
  thrLimit: any;
  personIdLoginUser: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  createdBy: string;
  pumpCity: any;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  dealerAccess: boolean;
  GSTNumber: string;
  lubricantList: any = [];
  modalReference: any;
  closeResult: string;


  constructor(private excelService: ExcelService, private modalService: NgbModal,
    private spinner: NgxSpinnerService, private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {

  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.createdBy = element.firstName + ' ' + element.lastName
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
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

    }
    this.getLubricants(this.fuelDealerId);
    this.cd.detectChanges()
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getLubricants(this.fuelDealerId);
  }

  getLubricants(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
          this.cd.detectChanges()
        }
      })
  }

  deleteLube(lubricantsId: any) {
    this.spinner.show()
    let data = {
      lubricantsId: lubricantsId,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteLubricantsPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("lubricant deleted successfully..")
            this.getLubricants(this.fuelDealerId);
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    }
    else {
      this.spinner.hide()
    }
  }

  editLube(lubricantsId: any, editLubeModal: any) {
    this.getLubeDetails(lubricantsId)
    this.modalReference = this.modalService.open(editLubeModal)
    this.modalReference.result.then((result: any) => {
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

  getLubeDetails(lubricantsId: any) {
    let data = {
      lubricantsId: lubricantsId,
    }
    this.post.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.lubeForm.controls["lubricantsId"].setValue(res.data[0].lubricantsId)
            this.lubeForm.controls["lubricantsName"].setValue(res.data[0].lubricantsName)
            this.lubeForm.controls["lubricantsUnit"].setValue(res.data[0].lubricantsUnit)
            this.lubeForm.controls["lubricantsHsnSacNumber"].setValue(res.data[0].lubricantsHsnSacNumber)
          }

        }
      })
  }

  updateLubricants() {
    if (this.lubeForm.value.lubricantsId) {
      if (this.lubeForm.value.lubricantsName) {
        if (this.lubeForm.value.lubricantsUnit) {
          if (this.lubeForm.value.lubricantsHsnSacNumber) {
            this.spinner.show()
            let data = {
              lubricantsId: this.lubeForm.value.lubricantsId,
              lubricantsName: this.lubeForm.value.lubricantsName,
              lubricantsUnit: this.lubeForm.value.lubricantsUnit,
              lubricantsHsnSacNumber: this.lubeForm.value.lubricantsHsnSacNumber,

            }
            this.post.updateLubricantsPOST(data)
              .subscribe(res => {
                if (res.status == 'OK') {
                  alert("lubricant updated successfully..")
                  this.lubeForm.reset();
                  this.getLubricants(this.fuelDealerId);
                  this.modalReference.close('close')
                  this.spinner.hide()
                } else {
                  alert("Error to Update..!")
                  this.spinner.hide()
                }
              })
          } else {
            alert("enter HSN/SAC number..")
          }
        } else {
          alert("select unit..")
        }
      } else {
        alert("enter lubricant name..")
      }
    } else {
      alert("error to update..")
    }

  }
}
