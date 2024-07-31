import { Component } from '@angular/core';

@Component({
  selector: 'app-tables-widget2',
  templateUrl: './tables-widget2.component.html',
})
export class TablesWidget2Component {
  dataDU = [
    { fuelProductId: "31", productName: "CNG", totalDU: 3 },
    { fuelProductId: "14", productName: "DIESEL", totalDU: 4 },
    { fuelProductId: "13", productName: "PETROL", totalDU: 6 },
    { fuelProductId: "30", productName: "XTRA", totalDU: 2 },
  ];
  dataNZ = [
    { fuelProductId: "31", productName: "CNG", totalNZ: 14 },
    { fuelProductId: "14", productName: "DIESEL", totalNZ: 11 },
    { fuelProductId: "13", productName: "PETROL", totalNZ: 10 },
    { fuelProductId: "30", productName: "XTRA", totalNZ: 4 },
  ];
  dataTK = [
    { fuelProductId: "31", productName: "CNG", totalTK: 4 },
    { fuelProductId: "14", productName: "DIESEL", totalTK: 4 },
    { fuelProductId: "13", productName: "PETROL", totalTK: 2 },
    { fuelProductId: "30", productName: "XTRA", totalTK: 1 },
  ]
  mergedArray: any = [];
  constructor() { }

  ngOnInit() {
    this.mergeArray();
  }
  mergeArray() {

    this.dataTK.map(res1 => {
      const dataJSON = {
        productName: "",
        tk: 0,
        du: 0,
        nz: 0
      }
      dataJSON.productName = res1.productName;
      dataJSON.tk = res1.totalTK;
      this.dataDU.map(res2 => {
        if (res1.productName == res2.productName) {
          dataJSON.du = res2.totalDU;
          this.dataNZ.map(res3 => {
            if (res1.productName == res3.productName) {
              dataJSON.nz = res3.totalNZ;
              this.mergedArray.push(dataJSON)
            }
          })
        }
      })
    })
  }

  addInfra(){
    alert("View Infra Page")
  }
}
