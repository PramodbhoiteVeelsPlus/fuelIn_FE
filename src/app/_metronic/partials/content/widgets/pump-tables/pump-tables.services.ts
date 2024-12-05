import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PumpTablesService {
    status: string;
    dataArray: any;
    date1: string;
    date2: string;
    FT: string;
    activeVehicleArray: any;
    date11: string;
    date22: string;
    activeVehicleLQArray: any;
    dataFTArray: any;
    totalFT: any;
    
    constructor(private http: HttpClient,
        private router: Router
    ) { }
    
    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;
    
    //API PATH
    private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
    private addLubricantPurchaseURL = this.baseURL + 'lubricants/addLubricantPurchase'; 
    private getLubricantPurchaseURL = this.baseURL + 'lubricants/getLubricantPurchase'; 
    private deleteLubricantPurchaseURL = this.baseURL + 'lubricants/deleteLubricantPurchase'; 
    private getFastagCorporateByCorpIdURL = this.baseURL + 'fastag/getFastagCorporateByCorpId';
    private getCorpWalletBalURL = this.baseURL + 'fastag/getCorpWalletBal';
    private getCorpWalletBalLQURL = this.baseURL + 'fastag/getCorpWalletBalLQ';
    private getCorpWalletDetailsByEntityURL = this.baseURL + 'lqCorpWallet/getCorpWalletDetailsByEntity'; 
    private getTransactionFastagByVeelsIdDatewiseURL = this.baseURL + 'fastag/getTransactionFastagByVeelsIdDatewise';
    private getTransactionFastagByVeelsIdDatewiseLQURL = this.baseURL + 'fastag/getTransactionFastagByVeelsIdDatewiseLQ';
    private getCorpTransURL = this.baseURL + 'fastag/getCorpTrans';
    private getFastagTransactionByCurrentDateLQURL = this.baseURL + 'fastag/getFastagTransactionByCurrentDateLQ';
    private getFastagVehicleMonthWiseURL = this.baseURL + 'fastag/getFastagVehicleMonthWise';
    private geTransactionFastagByVehicleNumberURL = this.baseURL + 'fastag/geTransactionFastagByVehicleNumber';
    private getAllVehicleNumberURL = this.baseURL + 'fastag/getAllVehicleNumber';
    private getTransactionFastagByVehicleNumberDatewiseURL = this.baseURL + 'fastag/getTransactionFastagByVehicleNumberDatewise';
    private getFastagVehicleMonthWiseLQURL = this.baseURL + 'fastag/getFastagVehicleMonthWiseLQ';
    private geTransactionFastagByVehicleNumberLQURL = this.baseURL + 'fastag/geTransactionFastagByVehicleNumberLQ';
    private getTransactionFastagByVehicleNumberDatewiseLQURL = this.baseURL + 'fastag/getTransactionFastagByVehicleNumberDatewiseLQ'; 
    private getFastagTollMonthWiseURL = this.baseURL + 'fastag/getFastagTollMonthWise';
    private geTransactionFastagByTollNameURL = this.baseURL + 'fastag/geTransactionFastagByTollName';
    private getLocationByLatlngURL = this.baseURL + 'fastag/getLocationByLatlng';
    private getTransactionFastagByTollNameDatewiseURL = this.baseURL + 'fastag/getTransactionFastagByTollNameDatewise';
    private getFastagTollMonthWiseLQURL = this.baseURL + 'fastag/getFastagTollMonthWiseLQ';
    private geTransactionFastagByTollNameLQURL = this.baseURL + 'fastag/geTransactionFastagByTollNameLQ'; 
    private getRechargeFastagByDateURL = this.baseURL + 'fastag/getRechargeFastagByDate';
    private getRechargeFastagByDateLQURL = this.baseURL + 'fastag/getRechargeFastagByDateLQ';
    private getFTVehicleListURL = this.baseURL + 'fastag/getFTVehicleList';  
    private getFTVehicleListLQURL = this.baseURL + 'fastag/getFTVehicleListLQ'; 
    private getVehicleWiseFtTransactionsURL = this.baseURL + 'fastag/getVehicleWiseFtTransactions'; 
    private getVehicleWiseFtTransactionsLQURL = this.baseURL + 'fastag/getVehicleWiseFtTransactionsLQ';
    private getShiftOngoingOPENDetailsByDealerIdURL = this.baseURL + 'shiftList/getShiftOngoingOPENDetailsByDealerId';
    private getTotalMeterSalesAndTallyEnteryURL = this.baseURL + 'shiftList/getTotalMeterSalesAndTallyEntery';
    private getCRSALESProductWiseDSRURL = this.baseURL + 'shiftList/getCRSALESProductWiseDSR';
    private getfuelDealerIdByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelDealerIdfromCorporateId';
    private getShiftDetailsByDealerIdURL = this.baseURL + 'shiftList/getShiftDetailsByDealerId';
    private getDUNZDetailsByShiftIdURL = this.baseURL + 'shiftList/getDUNZDetailsByShiftId';
    private updateTallySalesForPortalURL = this.baseURL + 'shiftList/updateTallySalesForPortal';

    

    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
    }

    //API FUNCTION
    // getFuelCreditRequestCorporateByfuelDealerIdURL
    getFuelCreditRequestCorporateByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestCorporateByfuelDealerIdURL, body, {
            headers: headers
        })
    }
    
    // addLubricantPurchaseURL
    addLubricantPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addLubricantPurchaseURL, body, {
            headers: headers
        })
    }

    // getLubricantPurchaseURL
    getLubricantPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubricantPurchaseURL, body, {
            headers: headers
        })
    }

    // deleteLubricantPurchaseURL
    deleteLubricantPurchasePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteLubricantPurchaseURL, body, {
            headers: headers
        })
    }

    // getFastagCorporateByCorpIdURL
    getFastagCorporateByCorpIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagCorporateByCorpIdURL, body, {
            headers: headers
        })
    }

    // getCorpWalletBalURL
    getCorpWalletBalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorpWalletBalURL, body, {
            headers: headers
        })
    }

    // getCorpWalletBalLQURL
    getCorpWalletBalLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorpWalletBalLQURL, body, {
            headers: headers
        })
    }

    // getCorpWalletDetailsByEntityURL
    getCorpWalletDetailsByEntityPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorpWalletDetailsByEntityURL, body, {
            headers: headers
        })
    }

    // getTransactionFastagByVeelsIdDatewiseURL
    getTransactionFastagByVeelsIdDatewisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionFastagByVeelsIdDatewiseURL, body, {
            headers: headers
        })
    }

    // getTransactionFastagByVeelsIdDatewiseLQURL
    getTransactionFastagByVeelsIdDatewiseLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionFastagByVeelsIdDatewiseLQURL, body, {
            headers: headers
        })
    }

    // getCorpTransURL
    getCorpTrans(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorpTransURL, body, {
            headers: headers
        })
    }
    
    // getFastagTransactionByCurrentDateLQURL
    getFastagTransactionByCurrentDateLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTransactionByCurrentDateLQURL, body, {
            headers: headers
        })
    }
    
    // getFastagVehicleMonthWiseURL
    getFastagVehicleMonthWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleMonthWiseURL, body, {
            headers: headers
        })
    }
    
    // geTransactionFastagByVehicleNumberURL
    geTransactionFastagByVehicleNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.geTransactionFastagByVehicleNumberURL, body, {
            headers: headers
        })
    }
    
    // getAllVehicleNumberURL
    getAllVehicleNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllVehicleNumberURL, body, {
            headers: headers
        })
    }
    
    // getTransactionFastagByVehicleNumberDatewiseURL
    getTransactionFastagByVehicleNumberDatewisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionFastagByVehicleNumberDatewiseURL, body, {
            headers: headers
        })
    }
    
    // getFastagVehicleMonthWiseLQURL
    getFastagVehicleMonthWiseLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleMonthWiseLQURL, body, {
            headers: headers
        })
    }
    
    // geTransactionFastagByVehicleNumberLQURL
    geTransactionFastagByVehicleNumberLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.geTransactionFastagByVehicleNumberLQURL, body, {
            headers: headers
        })
    }
    
    // getTransactionFastagByVehicleNumberDatewiseLQURL
    getTransactionFastagByVehicleNumberDatewiseLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionFastagByVehicleNumberDatewiseLQURL, body, {
            headers: headers
        })
    }

  setRoutingWithDate(status: string, dataArray: any, date1: string, date2: string, FT: string) {
    this.status = status
    this.dataArray = dataArray;
    this.date1 = date1;
    this.date2 = date2;
    this.FT = FT;
    // console.log('333333',this.status);
    // console.log(this.dataArray)
  }
  
  setRoutingActiveVehicleList(activeVehicleArray: any, date11: string, date22: string) {
    this.activeVehicleArray = activeVehicleArray;
    this.date11 = date11;
    this.date22 = date22;
  }
  
  setRoutingActiveVehicleLQList(activeVehicleLQArray: any, date11: string, date22: string) {
    this.activeVehicleLQArray = activeVehicleLQArray;
    this.date11 = date11;
    this.date22 = date22;
  }
      
  setRoutingWithVehicle(dataArray: any, dataFTArray: any, totalFT: any, date1: string, date2: string, FT: string) {
    this.dataArray = dataArray;
    this.dataFTArray = dataFTArray;
    this.totalFT = totalFT;
    this.date1 = date1;
    this.date2 = date2;
    this.FT = FT;
  }
    // getFastagTollMonthWiseURL
    getFastagTollMonthWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTollMonthWiseURL, body, {
            headers: headers
        })
    }
    
    // geTransactionFastagByTollNameURL
    geTransactionFastagByTollNamePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.geTransactionFastagByTollNameURL, body, {
            headers: headers
        })
    }
    
    // getLocationByLatlngURL
    getLocationByLatlngPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLocationByLatlngURL, body, {
            headers: headers
        })
    }
    
    // getTransactionFastagByTollNameDatewiseURL
    getTransactionFastagByTollNameDatewisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionFastagByTollNameDatewiseURL, body, {
            headers: headers
        })
    }
    
    // getFastagTollMonthWiseLQURL
    getFastagTollMonthWiseLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagTollMonthWiseLQURL, body, {
            headers: headers
        })
    }
    
    // geTransactionFastagByTollNameLQURL
    geTransactionFastagByTollNameLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.geTransactionFastagByTollNameLQURL, body, {
            headers: headers
        })
    }
    
    // getRechargeFastagByDateURL
    getRechargeFastagByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRechargeFastagByDateURL, body, {
            headers: headers
        })
    }
    
    // getRechargeFastagByDateLQURL
    getRechargeFastagByDateLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRechargeFastagByDateLQURL, body, {
            headers: headers
        })
    }
    
    // getFTVehicleListURL
    getFTVehicleListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTVehicleListURL, body, {
            headers: headers
        })
    }
    
    // getFTVehicleListLQURL
    getFTVehicleListLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTVehicleListLQURL, body, {
            headers: headers
        })
    }
    
    // getVehicleWiseFtTransactionsURL
    getVehicleWiseFtTransactionsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getVehicleWiseFtTransactionsURL, body, {
            headers: headers
        })
    }
    
    // getVehicleWiseFtTransactionsLQURL
    getVehicleWiseFtTransactionsLQPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getVehicleWiseFtTransactionsLQURL, body, {
            headers: headers
        })
    }
    
    // getShiftOngoingOPENDetailsByDealerIdURL
    getShiftOngoingOPENDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftOngoingOPENDetailsByDealerIdURL, body, {
            headers: headers
        })
    }
    
    // getTotalMeterSalesAndTallyEnteryURL
    getTotalMeterSalesAndTallyEnteryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalMeterSalesAndTallyEnteryURL, body, {
            headers: headers
        })
    }
    
    // getCRSALESProductWiseDSRURL
    getCRSALESProductWiseDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCRSALESProductWiseDSRURL, body, {
            headers: headers
        })
    }
    
    // getfuelDealerIdByCorporateIdURL
    getfuelDealerIdByCorporateIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getfuelDealerIdByCorporateIdURL, body, {
            headers: headers
        })
    }
    
    // getShiftDetailsByDealerIdURL
    getShiftDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftDetailsByDealerIdURL, body, {
            headers: headers
        })
    }
    
    // getDUNZDetailsByShiftIdURL
    getDUNZDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDUNZDetailsByShiftIdURL, body, {
            headers: headers
        })
    }
    
    // updateTallySalesForPortalURL
    updateTallySalesForPortalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTallySalesForPortalURL, body, {
            headers: headers
        })
    }
}