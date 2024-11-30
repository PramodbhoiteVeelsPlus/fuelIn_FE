import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ChartsService {
    crPurchaseTab: string;
    crPurchaseData: any = [];
    crPurchaseStartDate: any;
    crPurchaseEndDate: any;
    productIdArrayTx: any = [];
    mapId: any;
    fuelDealerId: any;
    manualNo: any;
    crPurchaseDataDay: any = [];
    crPurchaseDate: any;
    productIdArrayDay: any;
    custMapId: any;
    crPurchaseDataMonth: any = [];
    monthDay: any;
    productIdArrayMonth: any;
    fuelDealerCorpMapId: any;
    
    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path
    
  private getLastSixMonthsCrURL = this.baseURL + 'crCustomers/getLastSixMonthsCrDetails';
  private getTankByDealerProductIdURL = this.baseURL + 'fuelExpense/getTankByDealerProductId';
  private addOILCOMPANYDataInFuelExpenseURL = this.baseURL + 'fuelExpense/addOILCOMPANYDataInFuelExpense';
  private getOILCOMPANYDataInFuelExpenseURL = this.baseURL + 'fuelExpense/getOILCOMPANYDataInFuelExpense'; 
  private updateOilCompanyURL = this.baseURL + 'fuelExpense/updateOilCompany'; 
  private deleteExpenseURL = this.baseURL + 'fuelExpense/deleteExpense';
  private getFuelExpenseByMonthYearURL = this.baseURL + 'fuelExpense/getFuelExpenseByMonthYear';
  private addMonthlyVariationURL = this.baseURL + 'fuelExpense/addMonthlyVariation'; 
  private updateMonthlyVariationURL = this.baseURL + 'fuelExpense/updateMonthlyVariation';
  private getMappingAccByFuelDealerIdURL = this.baseURL + 'crCustomers/getMappingAccByFuelDealerId';
  private getPurchaseDetailsTxURL = this.baseURL + 'purchase/getPurchaseDetailsTx'; 
  private getTotalPurchaseDetailsTxURL = this.baseURL + 'purchase/getTotalPurchaseDetailsTx'; 
  private getTotalPurchaseByDayURL = this.baseURL + 'purchase/getTotalPurchaseByDay';
  private getPurchaseDetailsDailyURL = this.baseURL + 'purchase/getPurchaseDetailsDaily';
  private getPurchaseDetailsMonthlyURL = this.baseURL + 'purchase/getPurchaseDetailsMonthly';
  private getTankDetailByfuelDealerIdURL = this.baseURL + 'fuelTankDetail/getTankDetailByfuelDealerId';
  private getFuelProductURL = this.baseURL + 'fuelproductmaster/getFuelProduct';
  private addFuelTankDetailInBulkURL = this.baseURL + 'fuelTankDetail/addFuelTankDetailInBulk';
  private getTankDetailURL = this.baseURL + 'fuelTankDetail/getTankDetail';
  private getPumpNozzelByDealerIdURL = this.baseURL + 'fuelinframapping/getPumpNozzelByDealerId';
  private getTankByDealerIdURL = this.baseURL + 'fuelinframapping/getTankByDealerId';
  private addPumpInfraForAllURL = this.baseURL + 'fuelinframapping/addPumpInfraForAll';
  private getfuelinframappingDealerIdURL = this.baseURL + 'fuelinframapping/getfuelinframappingDealerId';
  private getStampingURL = this.baseURL + 'fuelinframapping/getStamping';
  private addStampingURL = this.baseURL + 'fuelinframapping/addStamping';
  private deleteStampingURL = this.baseURL + 'fuelinframapping/deleteStamping';
  private updateMapPumpInfraURL = this.baseURL + 'fuelinframapping/updateMapPumpInfra';
  private getFuelPriceDetailsForExcelURL = this.baseURL + 'fuelPrice/getFuelPriceDetailsForExcel';
  private addFuelPriceByDealerIdURL = this.baseURL + 'fuelPrice/addFuelPriceByDealerId'; 
  private getPriceByDealerIdURL = this.baseURL + 'fuelPrice/getPriceByDealerId';
  private editFuelPriceURL = this.baseURL + 'fuelPrice/editFuelPrice'; 







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
        
    }



    //////API Functions
    // getLastSixMonthsCrURL
    getLastSixMonthsCrPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLastSixMonthsCrURL, body, {
            headers: headers
        })
    }
    
    // getTankByDealerProductIdURL
    getTankByDealerProductIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankByDealerProductIdURL, body, {
            headers: headers
        })
    }
    
    // addOILCOMPANYDataInFuelExpenseURL
    addOILCOMPANYDataInFuelExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addOILCOMPANYDataInFuelExpenseURL, body, {
            headers: headers
        })
    }
    
    // getOILCOMPANYDataInFuelExpenseURL
    getOILCOMPANYDataInFuelExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOILCOMPANYDataInFuelExpenseURL, body, {
            headers: headers
        })
    }
    
    // updateOilCompanyURL
    updateOilCompanyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateOilCompanyURL, body, {
            headers: headers
        })
    }
    
    // deleteExpenseURL
    deleteExpensePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteExpenseURL, body, {
            headers: headers
        })
    }
    
    // getFuelExpenseByMonthYearURL
    getFuelExpenseByMonthYearPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelExpenseByMonthYearURL, body, {
            headers: headers
        })
    }
    
    // addMonthlyVariationURL
    addMonthlyVariationPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addMonthlyVariationURL, body, {
            headers: headers
        })
    }
    
    // updateMonthlyVariationURL
    updateMonthlyVariationPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateMonthlyVariationURL, body, {
            headers: headers
        })
    }
    
    // getMappingAccByFuelDealerIdURL
    getMappingAccByFuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMappingAccByFuelDealerIdURL, body, {
            headers: headers
        })
    }
    
    // getPurchaseDetailsTxURL
    getPurchaseDetailsTxPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPurchaseDetailsTxURL, body, {
            headers: headers
        })
    }
    
  setRouteForCrPurchaseTxReport(tab: string, crPurchaseData: any, startDate: any, endDate: any, productIdArrayTx: any, fuelDealerCorpMapId: any, fuelDealerId: any, manualNo: any) {
    this.crPurchaseTab = tab;
    this.crPurchaseData = crPurchaseData;
    this.crPurchaseStartDate = startDate;
    this.crPurchaseEndDate = endDate;
    this.productIdArrayTx = productIdArrayTx;
    this.mapId = fuelDealerCorpMapId;
    this.fuelDealerId = fuelDealerId;
    this.manualNo = manualNo;
  }
  setRouteForCrPurchaseDayReport(tab: string, crPurchaseDataDay: any, date: any, productIdArrayDay: any, fuelDealerCorpMapId: any, fuelDealerId: any, manualNo: any) {
    this.crPurchaseTab = tab;
    this.crPurchaseDataDay = crPurchaseDataDay;
    this.crPurchaseDate = date;
    this.productIdArrayDay = productIdArrayDay;
    this.custMapId = fuelDealerCorpMapId;
    this.fuelDealerId = fuelDealerId;
    this.manualNo = manualNo;
  }
  setRouteForCrPurchaseMonthReport(tab: string, crPurchaseDataMonth: any, monthDay: any, productIdArrayMonth: any, fuelDealerCorpMapId: any, fuelDealerId: any, manualNo: any) {
    this.crPurchaseTab = tab;
    this.crPurchaseDataMonth = crPurchaseDataMonth;
    this.monthDay = monthDay;
    this.productIdArrayMonth = productIdArrayMonth;
    this.fuelDealerCorpMapId = fuelDealerCorpMapId;
    this.fuelDealerId = fuelDealerId;    
    this.manualNo = manualNo;
  }
  
    
    // getTotalPurchaseDetailsTxURL
    getTotalPurchaseDetailsTxPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalPurchaseDetailsTxURL, body, {
            headers: headers
        })
    }
    
    // getTotalPurchaseByDayURL
    getTotalPurchaseByDayPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalPurchaseByDayURL, body, {
            headers: headers
        })
    }
    
    // getPurchaseDetailsDailyURL
    getPurchaseDetailsDailyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPurchaseDetailsDailyURL, body, {
            headers: headers
        })
    }
    
    // getPurchaseDetailsMonthlyURL
    getPurchaseDetailsMonthlyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPurchaseDetailsMonthlyURL, body, {
            headers: headers
        })
    }
    
    // getTankDetailByfuelDealerIdURL
    getTankDetailByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDetailByfuelDealerIdURL, body, {
            headers: headers
        })
    }
    
    // getFuelProductURL
    getFuelProductPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelProductURL, body, {
            headers: headers
        })
    }
    
    // addFuelTankDetailInBulkURL
    addFuelTankDetailInBulkPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addFuelTankDetailInBulkURL, body, {
            headers: headers
        })
    }
    
    // getTankDetailURL
    getTankDetailPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDetailURL, body, {
            headers: headers
        })
    }
    
    // getPumpNozzelByDealerIdURL
    getPumpNozzelByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPumpNozzelByDealerIdURL, body, {
            headers: headers
        })
    }
    
    // getTankByDealerIdURL
    getTankByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankByDealerIdURL, body, {
            headers: headers
        })
    }

    // addPumpInfraForAllURL
    addPumpInfraForAllPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addPumpInfraForAllURL, body, {
            headers: headers
        })
    }

    // getfuelinframappingDealerIdURL
    getfuelinframappingDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getfuelinframappingDealerIdURL, body, {
            headers: headers
        })
    }

    // getStampingURL
    getStampingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStampingURL, body, {
            headers: headers
        })
    }
  
    // addStampingURL
    addStampingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addStampingURL, body, {
            headers: headers
        })
    }
  
    // deleteStampingURL
    deleteStampingPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteStampingURL, body, {
            headers: headers
        })
    }
  
    // updateMapPumpInfraURL
    updateMapPumpInfraPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateMapPumpInfraURL, body, {
            headers: headers
        })
    }
  
    // getFuelPriceDetailsForExcelURL
    getFuelPriceDetailsForExcelPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelPriceDetailsForExcelURL, body, {
            headers: headers
        })
    }
  
    // addFuelPriceByDealerIdURL
    addFuelPriceByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addFuelPriceByDealerIdURL, body, {
            headers: headers
        })
    }
  
    // getPriceByDealerIdURL
    getPriceByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPriceByDealerIdURL, body, {
            headers: headers
        })
    }
  
    // editFuelPriceURL
    editFuelPricePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.editFuelPriceURL, body, {
            headers: headers
        })
    }

  





}
