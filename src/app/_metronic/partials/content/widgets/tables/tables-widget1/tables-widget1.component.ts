import { Component, ViewChild } from '@angular/core';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-tables-widget1',
  templateUrl: './tables-widget1.component.html',
})
export class TablesWidget1Component {
  arrayPrev = [
    { productSellingPrice: "50", productName: "CNG" },
    { productSellingPrice: "70", productName: "DIESEL" },
    { productSellingPrice: "80", productName: "PETROL" },
    { productSellingPrice: "100", productName: "XTRA" },
  ];
  arrayCurrent = [
    { productSellingPrice: "60", productName: "CNG" },
    { productSellingPrice: "80", productName: "DIESEL" },
    { productSellingPrice: "90", productName: "PETROL" },
    { productSellingPrice: "110", productName: "XTRA" },
  ]
  mergedArray: any = [];  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  constructor() { }

  ngOnInit() {
    this.mergeArray();
  }
  mergeArray() {

    this.arrayPrev.map(res1 => {
      const dataJSON = {
        productName: "",
        previousRate: "",
        currentRate: "",
      }
      dataJSON.productName = res1.productName;
      dataJSON.previousRate = res1.productSellingPrice;
      this.arrayCurrent.map(res2 => {
        if (res1.productName == res2.productName) {
          dataJSON.currentRate = res2.productSellingPrice;          
          this.mergedArray.push(dataJSON)
        }
      })
    })
  }

  async openModal() {
    return await this.modalComponent.open();
  }

}
