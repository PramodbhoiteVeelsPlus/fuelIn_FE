import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, NgbDatepickerConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../../stats/stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { PumpTablesService } from '../pump-tables.services';
import { Adv_TablesService } from '../../advance-tables/adv_tables.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-pump-tables-widget2',
  templateUrl: './pump-tables-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget2Component implements OnInit {
  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  userId: any;
  acceesGroup: any;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  userName: string;
  lubePurchaseDetails: any = [];
  lubePurchaseDetailsData: any = [];
  lubeStockDetails1: any = [];
  lubeStockDetails: any = [];
  excelDetails: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  lubricantStockLubricantHsnSac: string;
  lubricantStockCGST: string;
  lubricantStockSGST: string;
  lubricantStockIGST: string;
  createdBy: string;
  rowNumber: any;
  show: boolean = false;
  searchData: any;

  constructor(
    private modalService: NgbModal,
    private post: PumpTablesService,
    private post1: Adv_TablesService,
    private post2: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    // this.addLubePurchaseRow();
    this.getLubePurchase(this.fuelDealerId)
    // this.getGSTDetails()
    this.cd.detectChanges()
  }

  getLubePurchase(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getLubricantPurchasePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.lubePurchaseDetails = res.data;
          this.lubePurchaseDetailsData = res.data;
          if (res.data1.length) {
            if (res.data2.length || res.data3.length) {

              res.data1.map((res1: { lubricantStockLubricantsId: string; lubricantStockLubricantName: string; lubricantStockQuantity: any; lubricantStockQuantityInPieces: any; }) => {
                const dataJson = {
                  lubricantStockLubricantsId: '',
                  lubricantStockLubricantName: '',
                  lubricantStockQuantity: 0,
                  lubricantStockQuantityInPieces: 0,
                };

                dataJson.lubricantStockLubricantsId = res1.lubricantStockLubricantsId;
                dataJson.lubricantStockLubricantName = res1.lubricantStockLubricantName;
                dataJson.lubricantStockQuantity = Number(res1.lubricantStockQuantity);
                dataJson.lubricantStockQuantityInPieces = Number(res1.lubricantStockQuantityInPieces);
                if (res.data2.length) {
                  res.data2.map((res2: { fuelcreditLubeId: string; actualCreditQuantity: any; }) => {
                    if (res1.lubricantStockLubricantsId == res2.fuelcreditLubeId) {
                      dataJson.lubricantStockQuantity = 0;
                      dataJson.lubricantStockQuantityInPieces = 0;
                      dataJson.lubricantStockQuantity = Number(res1.lubricantStockQuantity) - Number(res2.actualCreditQuantity);
                      dataJson.lubricantStockQuantityInPieces = (Number(res1.lubricantStockQuantity) - Number(res2.actualCreditQuantity)) / (Number(res1.lubricantStockQuantity) / Number(res1.lubricantStockQuantityInPieces));

                    }
                  })
                }

                if (res.data3.length) {
                  this.lubeStockDetails1.push(dataJson);
                  console.log("lubeStockDetails1", this.lubeStockDetails1)
                } else {
                  this.lubeStockDetails.push(dataJson);
                }
              })
              if (res.data3.length) {
                this.getFinalStockDetail(res.data3)
                console.log("data3", res.data3)
              }
            } else {
              this.lubeStockDetails = res.data1;
            }
          }
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }


  getFinalStockDetail(data3: any[]) {
    this.lubeStockDetails1.map((res1: { lubricantStockLubricantsId: string; lubricantStockLubricantName: string; lubricantStockQuantity: any; lubricantStockQuantityInPieces: any; }) => {
      const dataJson = {
        lubricantStockLubricantsId: '',
        lubricantStockLubricantName: '',
        lubricantStockQuantity: 0,
        lubricantStockQuantityInPieces: 0,
      };

      dataJson.lubricantStockLubricantsId = res1.lubricantStockLubricantsId;
      dataJson.lubricantStockLubricantName = res1.lubricantStockLubricantName;
      dataJson.lubricantStockQuantity = Number(res1.lubricantStockQuantity);
      dataJson.lubricantStockQuantityInPieces = Number(res1.lubricantStockQuantityInPieces);

      data3.map(res2 => {
        if (res1.lubricantStockLubricantsId == res2.lubricantsId) {
          dataJson.lubricantStockQuantity = 0;
          dataJson.lubricantStockQuantityInPieces = 0;
          dataJson.lubricantStockQuantity = Number(res1.lubricantStockQuantity) - Number(res2.cashBillQuantity);
          dataJson.lubricantStockQuantityInPieces = (Number(res1.lubricantStockQuantity) - Number(res2.cashBillQuantity)) / (Number(res1.lubricantStockQuantity) / Number(res1.lubricantStockQuantityInPieces));

        }
      })
      this.lubeStockDetails.push(dataJson);
      console.log("lubeStockDetails", dataJson)
    })
  }

  getDetailsByFilter() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show();
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getLubricantPurchasePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.lubePurchaseDetails = res.data;
            this.lubePurchaseDetailsData = res.data;
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        })
    } else {
      alert("Please Select Date..!")
    }
  }

  exportToPDF() {
    var cols = [["Invoice Date", "Company Name", "Product", "Quantity", "Quantity In Pieces", "Taxable Amount", "Tax %", "Total Amount", "Created By"]];
    var rows = [];
    for (var key in this.lubePurchaseDetails) {
      var temp = [
        moment(this.lubePurchaseDetails[key].lubricantStockInvDate).format("DD-MM-YYYY"),
        this.lubePurchaseDetails[key].lubricantStockCompanyName,
        this.lubePurchaseDetails[key].lubricantStockLubricantName,
        this.lubePurchaseDetails[key].lubricantStockQuantity,
        this.lubePurchaseDetails[key].lubricantStockQuantityInPieces,
        Number(this.lubePurchaseDetails[key].lubricantStockTaxableAmt).toFixed(2),
        Number(this.lubePurchaseDetails[key].lubricantStockTaxInPercentage).toFixed(2) + ' %',
        Number(this.lubePurchaseDetails[key].lubricantStockTotalAmt).toFixed(2),
        this.lubePurchaseDetails[key].createdBy,
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.setFontSize(12);
    doc.text("LUBRICANT PURCHASE", 350, 35);
    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 110 },
        2: { cellWidth: 100 },
        3: { cellWidth: 100 },
        4: { cellWidth: 80 },
        5: { cellWidth: 60 },
        6: { cellWidth: 50 },
        7: { cellWidth: 80 },
        8: { cellWidth: 100 },
      },
      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("LubricantPurchase.pdf");
  }

  excelDownload() {
    this.excelDetails.length = 0
    this.lubePurchaseDetails.map((res: { lubricantStockInvDate: moment.MomentInput; lubricantStockCompanyName: any; lubricantStockLubricantName: any; lubricantStockQuantity: any; lubricantStockQuantityInPieces: any; lubricantStockTaxableAmt: any; lubricantStockTaxInPercentage: any; lubricantStockTotalAmt: any; createdBy: any; }) => {
      let json = {
        InvoiceDate: moment(res.lubricantStockInvDate).format("DD-MM-YYYY"),
        CompanyName: res.lubricantStockCompanyName,
        Product: res.lubricantStockLubricantName,
        Quantity: res.lubricantStockQuantity,
        QuantityInPieces: res.lubricantStockQuantityInPieces,
        TaxableAmount: Number(res.lubricantStockTaxableAmt),
        Tax: Number(res.lubricantStockTaxInPercentage) + ' %',
        TotalAmount: Number(res.lubricantStockTotalAmt),
        CreatedBy: res.createdBy,
      };
      this.excelDetails.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.excelDetails,
      "LubricantPurchase"
    );
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getLubePurchase(this.fuelDealerId)
  }

  changeValue(i: any, lubricantStockLubricantHsnSac: any, lubricantStockCGST: any, lubricantStockSGST: any, lubricantStockIGST: any, createdBy: any) {

    this.lubricantStockLubricantHsnSac = ''
    this.lubricantStockCGST = ''
    this.lubricantStockSGST = ''
    this.lubricantStockIGST = ''
    this.createdBy = ''
    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.lubricantStockLubricantHsnSac = lubricantStockLubricantHsnSac
        this.lubricantStockCGST = lubricantStockCGST
        this.lubricantStockSGST = lubricantStockSGST
        this.lubricantStockIGST = lubricantStockIGST
        this.createdBy = createdBy
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.lubricantStockLubricantHsnSac = lubricantStockLubricantHsnSac
      this.lubricantStockCGST = lubricantStockCGST
      this.lubricantStockSGST = lubricantStockSGST
      this.lubricantStockIGST = lubricantStockIGST
      this.createdBy = createdBy
    }
  }

  deleteLubricantPurchase(lubricantStockId: any) {
    let data = {
      lubricantStockId: lubricantStockId
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteLubricantPurchasePOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Lubricant Purchase Details deleted successfully..!")
            this.getLubePurchase(this.fuelDealerId)
          } else {
            alert("Error to Delete")
          }
        })
    } else {
    }
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query     
    this.lubePurchaseDetails = this.lubePurchaseDetailsData.filter((item: { lubricantStockLubricantName: any; }) =>
      item.lubricantStockLubricantName.toLowerCase().includes(query)
    );
    if (!this.lubePurchaseDetails.length) {
      this.lubePurchaseDetails = this.lubePurchaseDetailsData.filter((item: { lubricantStockCompanyName: any; }) =>
        item.lubricantStockCompanyName.toLowerCase().includes(query)
      );
    }
    if (!this.lubePurchaseDetails.length) {
      this.lubePurchaseDetails = this.lubePurchaseDetailsData.filter((item: { lubricantStockQuantity: any; }) =>
        item.lubricantStockQuantity.toLowerCase().includes(query)
      );
    }
    if (!this.lubePurchaseDetails.length) {
      this.lubePurchaseDetails = this.lubePurchaseDetailsData.filter((item: { lubricantStockTotalAmt: any; }) =>
        item.lubricantStockTotalAmt.toLowerCase().includes(query)
      );
    }
  }

}

