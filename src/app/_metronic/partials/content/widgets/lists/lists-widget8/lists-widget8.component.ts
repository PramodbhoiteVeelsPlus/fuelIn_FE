import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';

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
  selector: 'app-lists-widget8',
  templateUrl: './lists-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget8Component {
  shiftTimeForm = new FormGroup({
    shiftTimeFrom: new FormControl(''),
    shiftTimeTo: new FormControl(''),
    shiftName: new FormControl(''),
    fuelShiftTimeId: new FormControl(''),
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
  isUpdate: boolean = false;
  modalRef: any;
  closeResult: string;
  shiftTimeFromHrs: any;
  shiftTimeFromMin: any;
  shiftTimeToHrs: any;
  shiftTimeToMin: any;
  createdBy: string;
  fuelShiftTimeDetailsTime: any = [];

  constructor(
    private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.fuelShiftTimeDetailsTime = JSON.parse(localStorage.getItem('fuelShiftTimeDetailsTime') || '{}');
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
    this.createdBy = element.firstName + ' ' + element.lastName
    
    if (!this.fuelShiftTimeDetailsTime.length) {
      this.getShiftDetailsTime(this.fuelDealerId)
    } else {
      this.getShiftDetailsTime1(this.fuelDealerId)
    }
    this.cd.detectChanges()
  }

  addNewNameModal(AddShiftName: any) {
    this.isUpdate = false;
    this.modalRef = this.modalService.open(AddShiftName, { size: 'md' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  submitShiftTime() {
    if (this.shiftTimeFromHrs || this.shiftTimeFromHrs == 0) {
      if (this.shiftTimeToHrs) {

        this.shiftTimeForm.controls["shiftTimeFrom"].setValue(moment(this.shiftTimeFromHrs + '-' + this.shiftTimeFromMin, ["HH:mm"]).format("HH:mm"))
        this.shiftTimeForm.controls["shiftTimeTo"].setValue(moment(this.shiftTimeToHrs + '-' + this.shiftTimeToMin, ["HH:mm"]).format("HH:mm"))
        if (this.shiftTimeForm.value.shiftTimeFrom != 'Invalid date' && this.shiftTimeForm.value.shiftTimeTo != 'Invalid date') {
          this.spinner.show()
          let data = {
            fuelShiftTimeDealerId: this.fuelDealerId,
            fuelShiftTimeCreatedBy: this.createdBy,
            fuelShiftTimeDetails: this.shiftTimeForm.value.shiftTimeFrom + ' To ' + this.shiftTimeForm.value.shiftTimeTo,
            fuelShiftTimeShiftName: this.shiftTimeForm.value.shiftName,
            fuelShiftTimeFrom: this.shiftTimeForm.value.shiftTimeFrom,
            fuelShiftTimeTo: this.shiftTimeForm.value.shiftTimeTo,

          }
          this.post.addFuelShiftTimeDetailsPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                alert("Shift Time Details Added successfully..")
                this.getShiftDetailsTime(this.fuelDealerId);
                this.shiftTimeForm.reset();
                this.shiftTimeForm.controls["shiftName"].setValue("")
                this.shiftTimeFromHrs = ''
                this.shiftTimeFromMin = ''
                this.shiftTimeToHrs = ''
                this.shiftTimeToMin = ''
                this.modalRef.close('close');

                this.spinner.hide()
              }
              else {
                alert("Error to Add Details..")
                this.spinner.hide()
              }
            })
        } else {
          alert("please select or enter valid time")
        }

      } else {
        alert("please enter shift time To")
      }
    } else {
      alert("please select shift time From")
    }

  }

  getShiftDetailsTime(fuelDealerId: any) {
    this.spinner.show()
    this.fuelShiftTimeDetailsTime = []
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetailsTime = res.data;
            localStorage.setItem('fuelShiftTimeDetailsTime', JSON.stringify(this.fuelShiftTimeDetailsTime));
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetailsTime = [];
            localStorage.setItem('fuelShiftTimeDetailsTime', JSON.stringify([]));
            this.spinner.hide()
            this.cd.detectChanges()
          }
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  getShiftDetailsTime1(fuelDealerId: any) {
    this.fuelShiftTimeDetailsTime = []
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetailsTime = res.data;
            localStorage.setItem('fuelShiftTimeDetailsTime', JSON.stringify(this.fuelShiftTimeDetailsTime));
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetailsTime = [];
            localStorage.setItem('fuelShiftTimeDetailsTime', JSON.stringify([]));
            this.spinner.hide()
            this.cd.detectChanges()
          }
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  updateShiftTime() {
    if (this.shiftTimeFromHrs || this.shiftTimeFromHrs == 0) {
      if (this.shiftTimeToHrs) {

        this.shiftTimeForm.controls["shiftTimeFrom"].setValue(moment(this.shiftTimeFromHrs + '-' + this.shiftTimeFromMin, ["HH:mm"]).format("HH:mm"))
        this.shiftTimeForm.controls["shiftTimeTo"].setValue(moment(this.shiftTimeToHrs + '-' + this.shiftTimeToMin, ["HH:mm"]).format("HH:mm"))
        if (this.shiftTimeForm.value.shiftTimeFrom != 'Invalid date' && this.shiftTimeForm.value.shiftTimeTo != 'Invalid date') {

          this.spinner.show()
          let data = {
            fuelShiftTimeId: this.shiftTimeForm.value.fuelShiftTimeId,
            fuelShiftTimeDetails: this.shiftTimeForm.value.shiftTimeFrom + ' To ' + this.shiftTimeForm.value.shiftTimeTo,
            fuelShiftTimeShiftName: this.shiftTimeForm.value.shiftName,
            fuelShiftTimeFrom: this.shiftTimeForm.value.shiftTimeFrom,
            fuelShiftTimeTo: this.shiftTimeForm.value.shiftTimeTo,
          }
          this.post.updateFuelShiftTimeDetailsPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                alert("Shift Time Details Updated successfully..")
                this.getShiftDetailsTime(this.fuelDealerId);
                this.isUpdate = false;
                this.shiftTimeForm.reset();
                this.shiftTimeForm.controls["shiftName"].setValue("")
                this.shiftTimeFromHrs = ''
                this.shiftTimeFromMin = ''
                this.shiftTimeToHrs = ''
                this.shiftTimeToMin = ''
                this.modalRef.close('close');
                this.spinner.hide()
              }
              else {
                alert("Error to Update Details..")
                this.spinner.hide()
              }
            })
        } else {
          alert("please select or enter valid time")
        }
      } else {
        alert("please enter shift time To")
      }
    } else {
      alert("please select shift time From")
    }
  }

  cancel() {
    this.shiftTimeForm.reset()
    this.isUpdate = false;
    this.shiftTimeForm.controls["shiftName"].setValue("")
    this.shiftTimeFromHrs = ''
    this.shiftTimeFromMin = ''
    this.shiftTimeToHrs = ''
    this.shiftTimeToMin = ''
    this.modalRef.close('close');
  }

  getfuelShiftDetailById(fuelShiftTimeId: any, AddShiftName: any) {
    this.spinner.show()
    this.modalRef = this.modalService.open(AddShiftName, { size: 'md' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
    let data = {
      fuelShiftTimeId: fuelShiftTimeId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.isUpdate = true;
            this.shiftTimeForm.controls['fuelShiftTimeId'].setValue(res.data[0].fuelShiftTimeId);
            this.shiftTimeFromHrs = ((res.data[0].fuelShiftTimeFrom).toString()).slice(0, 2)
            this.shiftTimeFromMin = ((res.data[0].fuelShiftTimeFrom).toString()).slice(3, 5)
            this.shiftTimeToHrs = ((res.data[0].fuelShiftTimeTo).toString()).slice(0, 2)
            this.shiftTimeToMin = ((res.data[0].fuelShiftTimeTo).toString()).slice(3, 5)
            this.shiftTimeForm.controls['shiftName'].setValue(res.data[0].fuelShiftTimeShiftName);
            this.spinner.hide()
          } else {
            this.shiftTimeFromHrs = ''
            this.shiftTimeFromMin = ''
            this.shiftTimeToHrs = ''
            this.shiftTimeToMin = ''
            this.shiftTimeForm.controls['fuelShiftTimeId'].setValue('');
            this.shiftTimeForm.controls['shiftTimeFrom'].setValue('');
            this.shiftTimeForm.controls['shiftTimeTo'].setValue('');
            this.shiftTimeForm.controls['shiftName'].setValue('');
            this.isUpdate = false;
            this.spinner.hide()
          }
        }
        else {
          this.spinner.hide()
        }
      })
  }

  deleteShiftTime(fuelShiftTimeId: any) {
    this.spinner.show()
    let data = {
      fuelShiftTimeId: fuelShiftTimeId,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteFuelShiftTimeDetailsPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("shift time deleted successfully..")
            this.getShiftDetailsTime(this.fuelDealerId);
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
}
