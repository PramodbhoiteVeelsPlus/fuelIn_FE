import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal2Component } from 'src/app/_metronic/partials/layout/modals/modal2/modal2.component';
import { WidgetService } from '../../widgets.services';
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
  selector: 'app-tables-widget3',
  templateUrl: './tables-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget3Component implements OnInit {

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modal2Component: Modal2Component;
  dealerLoginVPId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
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
  vpPersonId: any;
  totalManager: any;
  totalOperator: any;
  dealerCorporateId: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = dealerData.fuelDealerId;
    this.dealerCorporateId = dealerData.corporateId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.vpPersonId = element.veelsPlusId
    // this.getCorporateById(this.dealerLoginVPId);
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modal2Component.open();
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
          this.getStaffDetails(this.fuelDealerId);
          this.getStaffCount(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getStaffDetails(fuelDealerId: any) {
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
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      })
  }

  //Dealer Update staff Mappingstatus using SwitchSlider
  updateMapping(status: any, fuelDealerStaffId: any, dealerMapStatus: string) {

    this.spinner.show()
    if (dealerMapStatus != "MAPPED") {
      if (status.target.checked) {
        dealerMapStatus = "MAPPED";

        let data = {
          dealerMapStatus: dealerMapStatus,
          fuelDealerStaffId: fuelDealerStaffId,

        }

        this.post.updateMapStatusforStaffPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Mapping Status Updated to MAPPED!")
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

  staffEdit(updateStaff: any,fuelDealerStaffId: any,userId: any,personId: any,firstName: any,lastName: any,designation: any,salary: any){

    this.fuelDealerStaffIdUpdate = fuelDealerStaffId,
    this.userIdUpdate = userId,
    this.personIdUpdate = personId,
    this.firstName = firstName,
    this.lastName = lastName,
    this.designation = designation
    this.salary = salary
    this.modalReference1 = this.modalService.open(updateStaff, {size:'lg'});
   
    this.modalReference1.result.then((result: any) => {
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
  
  UpdateDealerStaffDetails() {
    if(this.firstName && this.lastName){
      
      if(this.designation == 'OPERATOR'){
        this.accessGroupIdUpdate = '13'
        }
        if(this.designation == 'MANAGER' && this.accessGroupId == '12' ){
         this.accessGroupIdUpdate = '14'
         }
         if(this.designation == 'MANAGER' && this.accessGroupId == '19' ){
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
            this.switchedToStaff(this.personIdUpdate,this.accessGroupIdUpdate)
            this.getStaffDetails(this.fuelDealerId);
          }
          else {
            this.spinner.hide();
            this.modalReference1.close('close')
            alert("Error to update staff details!")
  
          }
        })
      }else{
          alert("Please Enter Name")
      }
    }
    
  switchedToStaff(personId: any,accessGroupId: string){
    let date = new Date();
    let data = {
      personId:personId,
      fuelDealerId: this.fuelDealerId,
      createdAt:moment(date).format('DD-MM-YYYY HH:mm:ss'),
      createdBy:this.vpPersonId,
      accessGroupId:accessGroupId
    }

    this.post.switchedToStaffPOST(data)
    .subscribe(res=>{

    })

  }
  
  closeModalEditStaff() {
    this.modalReference1.close('close');
  }
  
  //getStaffCountPOST
  getStaffCount(fuelDealerId: any){
    let data = {
        fuelDealerId: fuelDealerId,
    };
    this.post.getStaffCountPOST(data).subscribe((res) => {
        if (res.status == "OK") {
           this.totalOperator = res.data1[0].totalOperator;
           this.totalManager = res.data[0].totalManager;
           this.cd.detectChanges()
        }
    });
  }
}
