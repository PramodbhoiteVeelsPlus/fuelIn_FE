import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-tables-widget17',
  templateUrl: './tables-widget17.component.html',
  styleUrl: './tables-widget17.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget17Component {

  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    demoDealer: new FormControl(),
  });
  allDealerListSearch: any = [];
  allDealerList: any = [];
  pin: string;
  GSTNumber: string;
  email1: string;
  city: string;
  onBoardingStatus: string;
  state: string;
  demoDealer: string;
  fuelDealerId: string;
  hostPhone: string;
  userId: string;
  personId: string;
  headQuarterName: string;
  customerId: string;
  rowNumberLiteDealerList: any;
  showLiteDealerList: boolean = false;
  onBoardStatus: any;
  modalReference: any;
  closeResult: string;
  veelsPlusPersonId: any;
  headOffice: any;
  waive: any;
  allDealerListExcel: any = [];
  searchBoxLiteDealerList: FormControl = new FormControl();
  searchTermLiteDealerList: any;
  searchData: any;

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
    // this.currentMonthYear = moment(new Date()).format("MMM y")
    // this.lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
    // console.log("years", this.currentMonthYear, this.lastMonthYear)
    // this.getCurrentMonthCrPay()
    // this.getLastMonthCrPay()
    this.getAllDealerList();
    this.cd.detectChanges();
  }

  getAllDealerList() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allDealerList = []
      this.allDealerListSearch = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getAllDealerListPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.allDealerList = res.data;
            this.allDealerListSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("No Data Found..!")
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })

    } else {
      this.allDealerList = []
      this.allDealerListSearch = []
      this.spinner.show()
      let data = {

      }

      this.post.getAllDealerListPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.allDealerList = res.data;
            this.allDealerListSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.allDealerList = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  changeValueLiteDealerList(i: any, pin: string, GSTNumber: string, email1: string, city: string, state: string, onBoardingStatus: string, demoDealer: string, fuelDealerId: string, hostPhone: string, userId: string, personId: string, headQuarterName: string, customerId: string) {
    this.pin = ''
    this.GSTNumber = ''
    this.email1 = ''
    this.city = ''
    this.state = ''
    this.onBoardingStatus = ''
    this.demoDealer = ''
    this.fuelDealerId = ''
    this.hostPhone = ''
    this.userId = ''
    this.personId = ''
    this.headQuarterName = ''
    this.customerId = ''

    if (i == this.rowNumberLiteDealerList) {
      this.rowNumberLiteDealerList = ''
      if (this.showLiteDealerList == true) {
        this.showLiteDealerList = false;
      } else {
        this.showLiteDealerList = true;
        this.rowNumberLiteDealerList = i

        this.pin = pin
        this.GSTNumber = GSTNumber
        this.email1 = email1
        this.city = city
        this.state = state
        this.onBoardingStatus = onBoardingStatus
        this.demoDealer = demoDealer
        this.fuelDealerId = fuelDealerId
        this.hostPhone = hostPhone

        this.userId = userId
        this.personId = personId
        this.headQuarterName = headQuarterName
        this.customerId = customerId

      }
    } else {
      this.rowNumberLiteDealerList = i
      this.showLiteDealerList = true;
      this.pin = pin
      this.GSTNumber = GSTNumber

      this.email1 = email1
      this.demoDealer = demoDealer
      this.fuelDealerId = fuelDealerId
      this.hostPhone = hostPhone

      this.userId = userId
      this.personId = personId
      this.headQuarterName = headQuarterName
      this.customerId = customerId
    }

  }

  onBoarding(contentOnBoard1: any, ele: any, userId: string, personId: string) {
    this.onBoardStatus = ele;
    this.userId = userId;
    this.personId = personId;
    this.modalReference = this.modalService.open(contentOnBoard1, { size: 'sm' })
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

  onBoard() {
    let data = {
      userId: this.userId,
      onBoardingStatus: this.onBoardStatus,
      approvedBy: this.veelsPlusPersonId,
      personId: this.personId,
      headOffice: this.headOffice,
      customerId: this.customerId,
    }
    this.post.userOnboardingPOST(data)
      .subscribe(res => {
        alert(res.msg)
        this.modalReference.close('close')

        this.getAllDealerList();
      })
  }

  demoDealerActive(status: any, fuelDealerId: any, demoDealer: string) {
    if (demoDealer == "TRUE") {
      if (status.target.checked) {
        demoDealer = "FALSE";
        let data = {
          demoDealer: demoDealer,
          fuelDealerId: fuelDealerId,

        }
        this.post.updateDealerDemoStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Updated..")
            }
          })
      }
    } else if (demoDealer == "FALSE") {
      demoDealer = "TRUE";

      let data = {
        demoDealer: demoDealer,
        fuelDealerId: fuelDealerId,

      }

      this.post.updateDealerDemoStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Updated..")

          }

        })
    } else {
      alert("Please Select");

    }
  }

  doorDeliveryEnable(id: any, userId: any, status: any) {
    if (id.target.checked) {
      status = "TRUE";

      let data = {
        status: status,
        userId: userId
      };
      this.post.updateDoorStepDeliveryStatusPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Door Delivery Status Updated..!!")
          }
          else {
            alert("error to update")
          }

        })

    } else {
      status = "FALSE";

      let data = {
        status: status,
        userId: userId
      };
      this.post.updateDoorStepDeliveryStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Door Delivery Status Updated..!")
          }
          else {
            alert("error to update")
          }

        })
    }
  }

  removePerson(mobileNumber: any) {
    let data = {
      mobileNumber: mobileNumber
    }
    this.post.removeUserPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.getAllDealerList()
        }
        else {
        }
      })
  }

  exportExcel() {
    this.allDealerListExcel.length = 0

    this.allDealerList.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
      let json = {
        VeelsID: res.FuelVeelsId,
        MappedDate: moment(res.customerCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OilCompany: res.brandName,
        HostName: res.hostName,
        ContactNumber: res.hostPhone,
        EmailId: res.email1,
        GST: res.GSTNumber,
        AddressLine1: res.address1,
        AddressLine2: res.address2,
        City: res.city,
        State: res.state,
        PINCode: res.pin,
      };

      this.allDealerListExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.allDealerListExcel,
      "DealerList"
    );
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.allDealerList = this.allDealerListSearch.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { veelsPlusBranchID: any; }) =>
        item.veelsPlusBranchID.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { FuelVeelsId: any; }) =>
        item.FuelVeelsId.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { GSTNumber: any; }) =>
        item.GSTNumber.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { brandName: any; }) =>
        item.brandName.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { email1: any; }) =>
        item.email1.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { city: any; }) =>
        item.city.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { state: any; }) =>
        item.state.toLowerCase().includes(query)
      );
    }
    if (!this.allDealerList.length) {
      this.allDealerList = this.allDealerListSearch.filter((item: { pin: any; }) =>
        item.pin.toLowerCase().includes(query)
      );
    }
  }
  
  clearAllDealerList() {
    this.filterForm.reset();
    this.getAllDealerList();
  }
}
