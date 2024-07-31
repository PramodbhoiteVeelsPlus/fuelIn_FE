import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/app-date';
import moment from 'moment';

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
  product = [
    { productSellingPrice: "50", productName: "CNG", rate: '' },
    { productSellingPrice: "70", productName: "DIESEL", rate: '' },
    { productSellingPrice: "80", productName: "PETROL", rate: '' },
    { productSellingPrice: "100", productName: "XTRA", rate: '' },
  ];
  date = moment(new Date()).format("DD-MM-YYYY");
  constructor(private modalService: NgbModal,
    config: NgbDatepickerConfig,
    ) {    
    const currentDate = new Date();
    config.minDate = { year: 2024, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() + 1 };
    config.outsideDays = 'hidden';
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
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

  submit(){
    console.log("Product", this.product, this.date)
  }

  checkAmount(id: any) {
    if(id.target.value < 0){
   alert("Please enter valid fuel price")
   id.target.value = '';
    }
  }

}
