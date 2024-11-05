import { ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/app-date';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetService } from '../../../content/widgets/widgets.services';
import { ModalsService } from '../modals.services';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
})
export class ModalComponent {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
  private modalRef: NgbModalRef;
  
  date = moment(new Date()).format("DD-MM-YYYY");
  dealerLoginVPId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  allProductPriceList: any = [];
  accessGroupId: any;
  todayDate = new Date();
  productPriceDate = new Date();
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;

  constructor(
    private post: ModalsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef, private modalService: NgbModal) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }


  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroupId = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId;
    this.managerPersonId = element.personId;
    this.managerName = element.firstName + " " + element.lastName;
    this.getCorporateById(this.dealerLoginVPId);
    this.cd.detectChanges()
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }
    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
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
  getfuelDealerIdByCorporateId(loginSQLCorporateId: any) {
    let data = {
      corporateId: loginSQLCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getProductsByDealerId(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.allProductPriceList = res.data;
        // this.getProductDetails(res.data);
        this.cd.detectChanges()
      }
    });
  }

  checkAmount(id: any) {
    if (id.target.value < 0) {
      alert("Please enter valid fuel price");
      id.target.value = "";
    }
  }

  //addFuelPrice()
  submit() {
    if (this.accessGroupId == 12 || this.accessGroupId == 19) {
      this.spinner.show();
      let data = {
        allProductPriceList: this.allProductPriceList,
        sellingSetBy: this.fuelDealerId,
        productPriceTime: moment(this.todayDate).format("hh:mm:ss"),
        productPriceDate: moment(this.productPriceDate).format("YYYY-MM-DD"),
      };

      this.post.addFuelPriceByDealerIdPOST(data).subscribe((res) => {
        if (res.status == "OK") {
          alert("Fuel Price Set Successfully!");
          this.modalRef.close("close");
          this.allProductPriceList.length = 0;
          this.spinner.hide();

        } else {
          alert(res.msg);
          this.spinner.hide();
        }
      });
    } else {
      if (this.accessGroupId == 14 || this.accessGroupId == 21) {
        this.spinner.show();
        let data = {
          allProductPriceList: this.allProductPriceList,
          sellingSetBy: this.fuelDealerId,
          productPriceTime: moment(this.todayDate).format("hh:mm:ss"),
          productPriceDate: moment(this.productPriceDate).format("YYYY-MM-DD"),
          managerVPPersonId: this.managerVPPersonId,
          managerPersonId: this.managerPersonId,
          managerName: this.managerName,
        };

        this.post.addFuelPriceByDealerIdPOST(data).subscribe((res) => {
          if (res.status == "OK") {
            alert("Fuel Price Set Successfully!");
            this.modalRef.close("close");
            this.allProductPriceList.length = 0;
            this.spinner.hide();

          } else {
            alert(res.msg);
            this.spinner.hide();
          }
        });
      } else {
      }
    }
  }
}
