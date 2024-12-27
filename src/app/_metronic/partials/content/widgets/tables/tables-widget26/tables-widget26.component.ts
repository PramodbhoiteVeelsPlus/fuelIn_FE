import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-tables-widget26',
  templateUrl: './tables-widget26.component.html',
  styleUrl: './tables-widget26.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget26Component {
  veelsPlusPersonId: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  brandList: any = [];
  pageLength: any = [];
  modalRef: any;
  fuelProductsId: any;

  filterForm = new FormGroup({
    brandName: new FormControl(""),
    productName: new FormControl(""),
    productCategory: new FormControl("", Validators.required),
    productCode: new FormControl("", Validators.required),
  });

  productForm = new FormGroup({
    brandName: new FormControl(""),
    productName: new FormControl(""),
    productCategory: new FormControl("", Validators.required),
    productCode: new FormControl("", Validators.required),
  });

  closeResult: string;
  viewMaster: boolean = true;

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
    this.getBrandList();
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getBrandList();
  }

  getBrandList() {
    let data = {

    }

    this.post.getAllBrandsFuelProductPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.brandList = res.data
          this.cd.detectChanges();
        } else {

        }
      });

  }

  //UpdateModal
  update(edit: any, fuelProductsId: any, brandName: any, productCategory: any, productCode: any, productName: any) {
    this.modalRef = this.modalService.open(edit);
    this.fuelProductsId = fuelProductsId;
    this.filterForm.controls["brandName"].setValue(brandName);
    this.filterForm.controls["productCategory"].setValue(productCategory);
    this.filterForm.controls["productName"].setValue(productName);
    this.filterForm.controls["productCode"].setValue(productCode);

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  updateBrand() {
    let data = {
      fuelProductsId: this.fuelProductsId,
      brandName: this.filterForm.value.brandName,
      productCategory: this.filterForm.value.productCategory,
      productName: this.filterForm.value.productName,
      productCode: this.filterForm.value.productCode,
    }
    this.post.updateFuelProductPOST(data)
      .subscribe((res) => {
        if (res) {
          alert("Brand Updated Successfully!")
          this.getBrandList();
          this.modalRef.close('close')
        } else {
        }
      });
  }

  viewFuelMaster() {
    if (this.viewMaster == true) {
      this.viewMaster = false;
    } else {
      this.viewMaster = true;
    }
  }

  submitBrand() {
    if (this.productForm.value.brandName) {
      if (this.productForm.value.productCategory) {
        if (this.productForm.value.productName) {

          let data = {
            brandName: this.productForm.value.brandName,
            productCategory: this.productForm.value.productCategory,
            productName: this.productForm.value.productName,
            productCode: this.productForm.value.productCode,
          }
          console.log("data", data)
          // this.post.addFuelProductPOST(data)
          //   .subscribe((res) => {
          //     if (res) {
          //       alert("Brand Added Successfully!")
          //       this.productForm.reset();
          //       this.productForm.controls["productCategory"].setValue("");
          //       this.getBrandList();
          //     } else {
          //     }
          //   });
        } else {
          alert("Please enter product name")
        }
      } else {
        alert("Please select category")
      }
    }
    else {
      alert("Please enter oil brand name")
    }

  }

  clearForm() {
    this.productForm.reset();
  }
}
