import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
import { ExcelService } from 'src/app/pages/excel.service';

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
  selector: 'app-advance-tables-widget11',
  templateUrl: './advance-tables-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget11Component {
  filterCustomerList = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  vehicleList: any = [];
  vehicleListDetails: any = [];
  vehicleId: any;
  currentCorporateId: any;
  kitNo: any;
  serialNo: any;
  reqFstStatus: any;
  vehicleNumber: any;
  vehicleTagClass: any;
  vistFastagVehicleReplaceId: any;
  vistFastagVehicleUserId: any;
  modalReference: any;
  closeResult: string;
  acceesGroup: any;
  isTagassign: any = false;
  serialNoNew: any;
  newKitNo: any;
  kbMapid: any;
  fastagVichleDataKit: any = [];
  fastagDataKitDetails: any = [];
  personId: any;
  fastagVehicle: any;
  imageURL: any;




  constructor(private post: Adv_TablesService, private excelService: ExcelService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.acceesGroup = element.accessGroupId;

    if (this.acceesGroup == "17" || this.acceesGroup == "18") {
      // this.getKitNumberByPersonId();
    } else {
      // this.getKitNumberAll();
    }
    this.showAllVehicleList();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.showAllVehicleList();
  }

  showAllVehicleList() {
    let data = {

    }
    this.post.getAllVehicleListPOST(data)
      .subscribe(res => {

        if (res) {
          this.vehicleList = res.data;
        } else {
        }
        this.vehicleList.map(
          (detail: any) => {

            this.vehicleListDetails.push(detail)
          }
        )
      });
  }
  openVehicleModal(vehicleContent: any, vehicleId: any, kitNo: any, serialNo: any, reqFstStatus: any, vehicleNumber: any, vehicleTagClass: any, vistFastagVehicleReplaceId: any, currentCorporateId: any, vistFastagVehicleUserId: any) {
    this.vehicleId = vehicleId
    this.currentCorporateId = currentCorporateId
    this.kitNo = kitNo;
    this.serialNo = serialNo;
    this.reqFstStatus = reqFstStatus;
    this.vehicleNumber = vehicleNumber;
    this.vehicleTagClass = vehicleTagClass;
    this.vistFastagVehicleReplaceId = vistFastagVehicleReplaceId;
    this.vistFastagVehicleUserId = vistFastagVehicleUserId;
    this.modalReference = this.modalService.open(vehicleContent)
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


  getAllPay() {
    this.isTagassign = true;
    // this.getKitNumberAll();

  }
  getComplete() {
    this.isTagassign = false;
    // this.getKitNumberByPersonId();
  }

  findSerialNumberModel() {
    let data = {
      serialNo: this.serialNoNew
    }

    this.post.getSerialNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.newKitNo = res.data[0].kitNo
          this.kbMapid = res.data[0].kbMapid
        }
      })

  }


  getKitNumberByPersonId() {
    let data = {
      personId: this.personId
    }

    this.post.getAllKitNoByPersonIdPOST(data)
      .subscribe(res => {

        if (res) {
          this.fastagVichleDataKit = res;
          this.fastagDataKitDetails = res.data
        } else {
        }
      });
  }

  repalceTags() {
    let data =
    {
      entityId: this.vehicleNumber,
      oldKitNo: this.kitNo,
      newKitNo: this.newKitNo,
      profileId: "VC" + this.vehicleTagClass,
    }
    this.post.ReplaceTagPOST(data)
      .subscribe(res => {
        if (res.data.result != null) {
          let datau = {
            vistFastagVehicleReplaceId: this.vistFastagVehicleReplaceId,
            fastagVehicleId: this.fastagVehicle,
            reqFstStatus: 'REPLACED',
            kitNo: this.newKitNo,
            oldKitNo: this.kitNo,
            barcode: this.serialNoNew,
            vistFastagVehicleRegNo: this.vehicleNumber,
            vistFastagVehicleEntityId: this.currentCorporateId,
            vistVehicleId: this.vehicleId,
            vistFastagVehicleUserId: this.vistFastagVehicleUserId
          }
          if (res.data.result == 'SUCCESS' || res.data.result == 'success') {
            this.post.uprepFastagPOST(datau)
              .subscribe(res => {
                if (res.status == 'OK') {
                  alert(res.data.result);
                  this.updatekitBarCodeMap()
                } else {
                  alert(res.msg);
                }
              });
          }
          alert(res.data.exception.shortMessage);

        } else {
          alert(res.data.exception.shortMessage);

        }

      });

    this.modalService.dismissAll();

  }


  updatekitBarCodeMap() {
    let data = {
      kitNo: this.newKitNo,
      parentId: this.currentCorporateId,
      entityId: this.vehicleNumber,
      status: "MAPPED",
      completedStatus: 'COMPLETED',
      kitbarcodemapCreatedBy: this.personId
    }

    this.post.updatekitBarCodeMapPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
        }
      })
  }

  updateTags(kitNo: any) {
    let datat = {
      kitNo: kitNo,
      excCode: '03',
      tagOperation: 'add'
    }

    this.post.updateTagPOST(datat)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
        }
      })
  }
  
  openImage(previousFastagImage: any){
    var link = this.imageURL + previousFastagImage;
    window.open(link)  
  }

}
