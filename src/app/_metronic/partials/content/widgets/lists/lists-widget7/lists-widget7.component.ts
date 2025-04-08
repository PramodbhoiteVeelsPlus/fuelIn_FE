import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';

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
  selector: 'app-lists-widget7',
  templateUrl: './lists-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget7Component {
  fuelDealerId: any;
  dealerCorporateId: any;
  // dealerData: any;
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
  allShift: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  shiftId: any;
  modalRefpass: any;
  closeResult: string;
  password: any;
  modalDeleteShift: any;
  shiftTimeId: any;
  staffId: any;

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
    this.allShift = JSON.parse(localStorage.getItem('allShift') || '{}');
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.userId = element.userId;
    this.dealerLoginId = element.veelsPlusCorporateID;
    
    if (this.accessGroup == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
      this.pumpCity = dealerData.city
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
    }

    if (this.accessGroup == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.pumpCity = managerData.city
      this.companyName = managerData.companyName
      this.oilCompanyName = managerData.brandName
      this.brandName = managerData.brandName
      this.state = managerData.state
      this.pin = managerData.pin
      this.city = managerData.city
      this.phone1 = managerData.hostPhone
    }

    if (!this.allShift.length) {
      this.getAllOngoingShift(this.fuelDealerId)
    } else {
      this.getAllOngoingShift1(this.fuelDealerId)
    }
    this.cd.detectChanges()
  }

  getAllOngoingShift(fuelDealerId: any) {
    this.spinner.show()
    this.allShift = []
    const data = {
      dealerId: fuelDealerId,
    };
    this.post.getShiftOngoingDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          localStorage.setItem('allShift', JSON.stringify(this.allShift));
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          localStorage.setItem('allShift', JSON.stringify([]));
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getAllOngoingShift1(fuelDealerId: any) {
    this.allShift = []
    const data = {
      dealerId: fuelDealerId,
    };
    this.post.getShiftOngoingDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          localStorage.setItem('allShift', JSON.stringify(this.allShift));
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          localStorage.setItem('allShift', JSON.stringify([]));
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllOngoingShift(this.fuelDealerId);
  }

  routeShift(date: string) {
    this.post.setNavigate(date, 'Book')
    this.router.navigate(['/shift/addShift']);
  }

  askForPass(PasswordTemplate: any, idfuelShiftDetails: any) {
    this.shiftId = idfuelShiftDetails
    this.modalRefpass = this.modalService.open(PasswordTemplate)
    this.modalRefpass.result.then((result: any) => {
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

  comparePasswordForDelete(deleteShift: any) {
    // var cancelReq
    this.spinner.show()
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          this.modalRefpass.close('close')
          this.password = "";
          this.spinner.hide()
          this.deleteShiftModal(deleteShift)
        } else {
          alert(result.msg)
          this.password = "";
          this.spinner.hide()
        }
      });
  }

  deleteShiftModal(deleteShift: any) {
    this.modalDeleteShift = this.modalService.open(deleteShift, { size: 'sm' })
    this.modalDeleteShift.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteShiftById() {
    if (this.shiftId) {
      this.spinner.show()
      let data = {
        shiftId: this.shiftId,
      }
      this.post.deleteShiftByShiftIdNEWPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Shift Deleted successfully..!")
            this.modalDeleteShift.close('close')
            this.getAllOngoingShift(this.fuelDealerId);
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            alert("Error to Delete..")
            this.spinner.hide()
            this.cd.detectChanges()
          }
        });

    } else {
      alert("Error to Delete..")
      this.spinner.hide()
      this.cd.detectChanges()
    }
  }

  closeModal() {
    this.modalDeleteShift.close('close')
  }

  askForConfirmDelete(confirmdeleteTemplate: any,) {
    this.modalRefpass = this.modalService.open(confirmdeleteTemplate)
    this.modalRefpass.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }


}
