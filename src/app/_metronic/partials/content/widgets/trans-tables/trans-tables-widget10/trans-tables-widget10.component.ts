import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
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
  selector: 'app-trans-tables-widget10',
  templateUrl: './trans-tables-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget10Component implements OnInit {

  dealerForm = new FormGroup({
    logo: new FormControl(''),
  });

  fuelDealerId: any;
  accessGroup: any;
  personName: string;
  personMobileNumber: any;
  personEmail: any;
  personId: any;
  keyPerson: string;
  dealerEmail: any;
  dealerMobile: any;
  ownerName: string;
  pumpName: any;
  firstName: string;
  email: any;
  logo: any;
  logoLinkDoc: any;
  mobileNumber: any;
  brandName: any;
  fuelDealerVFId: any;
  bussinessType: any;
  bussinessGSTNumber: any;
  uniqueCode: any;
  addressLine1: any;
  addressLine2: any;
  pinCode: any;
  state: any;
  district: any;
  city: any;
  cityArea: any;
  geoLocation: any;
  highwayNumber: any;
  phone2: any;
  imageUrl: any;
  customerId: any;
  individualBankDoc: File;
  individualBankLinkDoc: any;
  personNameLogin: any;
  corporateIdForVendor: any;
  individualSalesVolume: File;
  individualSalesVolumeDoc: any;


  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';

  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    var managerData = JSON.parse(localStorage.getItem('managerData') || '');
    this.ownerName = element.firstName + ' ' + element.lastName
    this.accessGroup = element.accessGroupId
    this.personId = element.personId;
    this.keyPerson = element.firstName + ' ' + element.lastName;
    this.firstName = element.firstName + ' ' + element.lastName;
    this.personNameLogin = element.firstName + ' ' + element.lastName;
    this.dealerEmail = element.email1;
    this.dealerMobile = element.phone1;
    this.pumpName = element.companyName;
    this.email = element.email1;
    this.mobileNumber = element.phone1;
    this.brandName = element.brandName;
    this.fuelDealerVFId = managerData.FuelVeelsId;
    this.bussinessType = managerData.bussinessType;
    this.bussinessGSTNumber = managerData.GSTNumber;
    this.uniqueCode = managerData.uniqueCodeAssigned;
    this.addressLine1 = managerData.address1;
    this.addressLine2 = managerData.address2;
    this.pinCode = managerData.pin;
    this.state = managerData.state;
    this.district = managerData.dist;
    this.city = managerData.city;
    this.cityArea = managerData.cityArea;
    this.geoLocation = managerData.geoLocation;
    this.highwayNumber = managerData.highwayNumber;
    this.phone2 = managerData.phone2;
    this.customerId = managerData.customerId
    this.corporateIdForVendor = managerData.corporateId;
    this.getPersonDetails(this.personId)
    this.cd.detectChanges()
  }

  getPersonDetails(id: any) {
    let data = {
      personId: id
    }
    this.post.PersonByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.personName = res.personId[0].firstName + ' ' + res.personId[0].lastName
          this.personMobileNumber = res.personId[0].phone1
          this.personEmail = res.personId[0].email1
        }
      });
  }

  onlogoImagePicked(event: Event) {
    this.spinner.show();
    // const FILE = (event.target as HTMLInputElement).files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const FILE = input.files[0];
      this.logo = FILE;
      const imageForm = new FormData();
      imageForm.append('image', this.logo);
      this.post.imageUpload(imageForm).subscribe(res => {
        this.imageUrl = (res as any)['image'];
        this.logoLinkDoc = this.imageUrl;

        if (this.logoLinkDoc) {
          let data = {
            logo: this.logoLinkDoc,
            customerId: this.customerId


          }
          this.post.updateLogoPOST(data)
            .subscribe(res => {
              alert(res.msg)
              this.spinner.hide();
            })
        }
      });;
    } else {
      console.log('No file selected.');
    }
  }


  onIndividualBankDocPicked(event: Event): void {
    this.spinner.show();
    //  const FILE = (event.target as HTMLInputElement).files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const FILE = input.files[0];
      this.individualBankDoc = FILE;
      const imageForm = new FormData();
      imageForm.append('image', this.individualBankDoc);
      this.post.imageUpload1(imageForm).subscribe(res => {
        this.imageUrl = (res as any)['image'];
        this.individualBankLinkDoc = this.imageUrl;
        this.addDocumentDetails('BANK STATEMENT', this.individualBankLinkDoc, 'DEALER SELF')
      });;
    } else {
      console.log('No file selected.');
    }
  }

  addDocumentDetails(documetsName: string, documetsPath: any, documetsType: string) {
    let data = {
      documetsCreatedBy: this.personNameLogin,
      documetsEntryFrom: 'PORTAL',
      documetsCreatedByPersonId: this.personId,
      documetsCorporateId: this.corporateIdForVendor,
      documetsPersonId: this.personId,
      documetsName: documetsName,
      documetsPath: documetsPath,
      documetsType: documetsType,
      documentsCustBusinessType: 'DEALER'
    }

    this.post.addDocDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.spinner.hide();
        } else {
          alert(res.msg)
          this.spinner.hide();
        }
      })
  }

  onIndividualSalesVolumePicked(event: Event): void {
    this.spinner.show();
    //  const FILE = (event.target as HTMLInputElement).files[0];
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const FILE = input.files[0];
     this.individualSalesVolume = FILE;
     const imageForm = new FormData();
     imageForm.append('image', this.individualSalesVolume);
     this.post.imageUpload1(imageForm).subscribe(res => {
       this.imageUrl = (res as any)['image'];
       this.individualSalesVolumeDoc = this.imageUrl;
       this.addDocumentDetails('SALES VOLUME', this.individualSalesVolumeDoc,'DEALER SELF')
     });;
    } else {
      console.log('No file selected.');
    }
  }
}

