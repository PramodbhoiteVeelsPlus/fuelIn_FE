import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
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
  selector: 'app-tables-widget21',
  templateUrl: './tables-widget21.component.html',
  styleUrl: './tables-widget21.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget21Component {
  veelsPlusPersonId: any;
  primeDealerReqList: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  personId: any;
  primeDealerStatus: any;
  fuelDealerConversionCurrentAccessGroupId: any;
  fuelDealerConversionId: any;
  accessGroup: any;
  firstName: any;
  lastName: any;
  companyName: any;
  city: any;
  email: any;
  state: any;
  fuelDealerId: any;
  brandName: any;
  mobileNumber: any;
  fuelDealerConversionStatus: any;
  modalReference: any;
  closeResult: string;

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
    this.getPrimeDealerReqList();
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getPrimeDealerReqList();
  }

  getPrimeDealerReqList() {
    this.spinner.show();
    let data = {

    }

    this.post.getPrimeDealerReqListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.primeDealerReqList = res.data;
        this.spinner.hide()
      } else {
        this.primeDealerReqList = [];
        this.spinner.hide()
      }
    })
  }

  onBoarding1(primeReq: any, ele: any, ele1: any, fuelDealerConversionStatus: any, fuelDealerConversionId: any, accessId: any, personId: any, firstName: any, lastName: any, companyName: any, city: any, email1: any, state: any, fuelDealerId: any, brandName: any, hostPhone: any) {
    this.primeDealerStatus = ele;
    this.personId = personId;
    this.fuelDealerConversionCurrentAccessGroupId = ele1
    this.fuelDealerConversionId = fuelDealerConversionId
    this.accessGroup = accessId
    this.firstName = firstName
    this.lastName = lastName
    this.companyName = companyName
    this.city = city
    this.email = email1
    this.state = state
    this.fuelDealerId = fuelDealerId
    this.brandName = brandName
    this.mobileNumber = hostPhone
    this.fuelDealerConversionStatus = fuelDealerConversionStatus
    this.modalReference = this.modalService.open(primeReq, { size: 'sm' })
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }


  primeDealerRequest() {

    let data = {
      fuelDealerConversionId: this.fuelDealerConversionId,
      primeDealerStatus: this.primeDealerStatus,
      personId: this.personId,
      fuelDealerConversionPreAccessGroupId: this.accessGroup,
      fuelDealerConversionCreatedAt: moment(new Date()).format('YYYY-MM-DD'),
      fuelDealerConversionCreatedBy: this.personId,
      fuelDealerConversionCurrentAccessGroupId: this.fuelDealerConversionCurrentAccessGroupId,
      accessGroupId: this.fuelDealerConversionCurrentAccessGroupId,
      userName: this.firstName + ' ' + this.lastName,
      companyName: this.companyName,
      mobileNumber: this.mobileNumber,
      city: this.city,
      email: this.email,
      state: this.state,
      fuelDealerId: this.fuelDealerId,
      oilCompany: this.brandName,
      fuelDealerConversionStatus: this.fuelDealerConversionStatus,
    }
    // console.log(data)
    this.post.updatePrimeUserStatusPOST(data)
      .subscribe(res => {
        alert(res.msg)
        this.modalReference.close('close')

        this.getPrimeDealerReqList();
      })
  }
}
