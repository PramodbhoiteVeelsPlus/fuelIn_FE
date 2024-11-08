import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class Adv_TablesService {

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;

    ///// API path
    private getAllCustomerListURL = this.baseURL + 'fastag/getAllCustomerList';
    private getAllCustomerListDateRangeURL = this.baseURL + 'fastag/getAllCustomerListDateRange';
    private getvendorDetailsURL = this.baseURL + 'loanRequest/getvendorDetails';
    private creditStatusURL = this.baseURL + 'loanRequest/creditStatus';
    private updateVyanaByVistUserIdURL = this.baseURL + 'loanRequest/updateVyanaByVistUserId';
    private vendoronboardingURL = this.baseURL + 'loanRequest/vendoronboarding';
    private getFTCustomerListByDateRangeURL = this.baseURL + 'fastag/getFTCustomerListByDateRange';
    private getFTCustomerListURL = this.baseURL + 'fastag/getFTCustomerList';
    private getFTAllVehicleListURL = this.baseURL + 'fastag/getFTAllVehicleList';
    private getFTAllVehicleListDateRangeURL = this.baseURL + 'fastag/getFTAllVehicleListDateRange';
    private getFastagVehicleListByUserIdURL = this.baseURL + 'fastag/getFastagVehicleListByUserId';
    private addVistVehicleByExcelURL = this.baseURL + 'kitbarcodemap/addVistVehicleByExcel'
    private getVehicledataFromSignzyURL = this.baseURL + 'vehicle/getVehicledataFromSignzy';
    private getAllFTVehicleListByVehicleNumberURL = this.baseURL + 'fastag/getAllFTVehicleListByVehicleNumber';
    private getkycDataURL = this.baseURL + 'kyc/getAllkyc';
    private userOnboardingURL = this.baseURL + 'user/userOnboarding';
    private waiveoffPaymentUpdateURL = this.baseURL + 'corporate/waiveoffPaymentUpdate';
    private updateSmsStatusURL = this.baseURL + 'user/updateSmsStatus';
    private updateemailStatusURL = this.baseURL + 'user/updateemailStatus';
    private deleteDsrDetailsURL = this.baseURL + 'dsrDetails/deleteDSRDetail';
    private getDsrMeterSalesURL = this.baseURL + 'dsr/getDsrMeterSales';
    private getTankDSRDetailURL = this.baseURL + 'dsr/getTankDSRDetails';
    private getAllKitNoURL = this.baseURL + 'fastag/getAllKitNo';
    private getAllEntityDetailsURL = this.baseURL + 'fastag/getAllEntityDetails';
    private aadFastagEntityDetailURL = this.baseURL + 'fastag/aadFastagEntityDetail';
    private updateFastagEntityDetailURL = this.baseURL + 'fastag/updateFastagEntityDetail';
    private getAllEntityIdURL = this.baseURL + 'coinConversion/getAllEntityId';
    private getRechargeForFastagURL = this.baseURL + 'fastag/getRechargeForFastag';
    private getcustmerIdByEntityIdURL = this.baseURL + 'coinConversion/getcustmerIdByEntityId';
    private getCoinDataMonthWiseURL = this.baseURL + 'coinConversion/getCoinDataMonthWise';
    private getTranslogForFastagURL = this.baseURL + 'fastag/getTranslogForFastag';
    private getredeemCoinMonthWiseURL = this.baseURL + 'coinConversion/getredeemCoinMonthWise';
    private addRedeemCoinURL = this.baseURL + 'coinConversion/addRedeemCoin';
    private getRedeemInfoByCustomerIdURL = this.baseURL + 'coinConversion/getRedeemInfoByCustomerId';
    private getCorporateDetailsForFastagURL = this.baseURL + 'fastag/getCorporateDetailsForFastag';
    private serchPhoneForFastagURL = this.baseURL + 'fastag/serchPhoneForFastag';
    private userRegisterURL = this.baseURL + 'register/userRegister';
    private postAddressUrl = this.baseURL + 'address/addAddress';
    private addCorporateUrl = this.baseURL + 'corporate/addCorporate';
    private getCorporateByIdUrl = this.baseURL + 'corporate/getCorporateById';
    private PostCustomer = this.baseURL + 'customer/addCustomer';
    private updateVeelsPlusCorporateIdwithPermURL = this.baseURL + 'register/updateVeelsPlusCorporateIdwithPerm';
    private addkycURL = this.baseURL + 'kyc/addKYC';
    private findPhoneNumberURL = this.baseURL + 'register/findPhoneNumber';
    private aadFastagDataURL = this.baseURL + 'fastag/aadFastagData';
    private updateCorpFastagURL = this.baseURL + 'fastag/updateCorpFastag';
    private serchPhoneForFastagLQURL = this.baseURL + 'fastag/serchPhoneForFastagLQ';
    private getCorporateDetailsForFastagLQURL = this.baseURL + 'fastag/getCorporateDetailsForFastagLQ';
    private aadFastagDataLQURL = this.baseURL + 'fastag/aadFastagDataLQ';
    private getCorpWalletDetailsByEntityURL = this.baseURL + 'lqCorpWallet/getCorpWalletDetailsByEntity';
    private addCorpWalletDetailsURL = this.baseURL + 'lqCorpWallet/addCorpWalletDetails';
    private getEntityCountByEntityIdURL = this.baseURL + 'fastag/getEntityCountByEntityId';
    private getEntityIdAllLQURL = this.baseURL + 'fastag/getEntityIdAllLQ1';
    private getEntityCountByEntityIdLQURL = this.baseURL + 'fastag/getEntityCountByEntityIdLQ';
    private getAllCoinConversionByCustomerIdLockedURL = this.baseURL + "coinConversion/getAllCoinConversionForLockedByCustomerId";
    private addCoinDetailsByPassURL = this.baseURL + 'coinConversion/addCoinDetailsByPass';
    private getAllVehicleListURL = this.baseURL + 'fastag/getAllVehicleList';
    private getSerialNumberURL = this.baseURL + 'fastag/getSerialNumber'
    private getAllKitNoByPersonIdURL = this.baseURL + 'fastag/getAllKitNoByPersonId';
    private ReplaceTagURL = this.baseURL + 'fastag/ReplaceTag';
    private uprepFastagURL = this.baseURL + 'fastag/uprepFastag';
    private updatekitBarCodeMapURL = this.baseURL + 'kitbarcodemap/updatekitBarCodeMap'
    private updateTagURL = this.baseURL + 'fastag/updateTag';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');
        
    }



    //////API Functions
    // getAllCustomerListURL
    getAllvishUserCustomerList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllCustomerListURL, {
            headers: headers
        })
    }

    // getAllCustomerListDateRangeURL
    getAllCustomerListDateRangePOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCustomerListDateRangeURL, body, {
            headers: headers
        })
    }

    // getvendorDetailsURL
    getvendorDetailsPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getvendorDetailsURL, body, {
            headers: headers
        })
    }

    // creditStatusURL
    creditStatusPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.creditStatusURL, body, {
            headers: headers
        })
    }

    // updateVyanaByVistUserIdURL
    updateVyanaByVistUserIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateVyanaByVistUserIdURL, body, {
            headers: headers
        })
    }

    // vendoronboardingURL
    vendoronboardingPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.vendoronboardingURL, body, {
            headers: headers
        })
    }

    // getFTCustomerListByDateRangeURL
    getFTCustomerListByDateRangePost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTCustomerListByDateRangeURL, body, {
            headers: headers
        })
    }

    // getFTCustomerListURL
    getFastagCustomerList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getFTCustomerListURL, {
            headers: headers
        })
    }

    // getFTAllVehicleListURL
    getFTAllVehicleList(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getFTAllVehicleListURL, {
            headers: headers
        })
    }

    // getFTAllVehicleListDateRangeURL
    getFTAllVehicleListDateRangePost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFTAllVehicleListDateRangeURL, body, {
            headers: headers
        })
    }

    // getFastagVehicleListByUserIdURL
    getFastagVehicleListByUserIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFastagVehicleListByUserIdURL, body, {
            headers: headers
        })
    }

    // addVistVehicleByExcelURL
    addVistVehicleByExcelPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addVistVehicleByExcelURL, body, {
            headers: headers
        })
    }

    // getVehicledataFromSignzyURL
    getVehicledataFromSignzyPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getVehicledataFromSignzyURL, body, {
            headers: headers
        })
    }

    // getAllFTVehicleListByVehicleNumberURL
    getAllFTVehicleListByVehicleNumberPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllFTVehicleListByVehicleNumberURL, body, {
            headers: headers
        })
    }

    // getkycDataURL
    getkycDetails(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getkycDataURL, {
            headers: headers
        })
    }

    // userOnboardingURL
    userOnBoard(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.userOnboardingURL, body, {
            headers: headers
        })
    }

    // waiveoffPaymentUpdateURL
    waiveoffPaymentUpdateURLPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.waiveoffPaymentUpdateURL, body, {
            headers: headers
        })
    }

    // updateSmsStatusURL
    updateSmsStatusPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateSmsStatusURL, body, {
            headers: headers
        })
    }

    // updateemailStatusURL
    updateemailStatusPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateemailStatusURL, body, {
            headers: headers
        })
    }

    // deleteDsrDetailsURL
    deleteDsrDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteDsrDetailsURL, body, {
            headers: headers
        })
    }

    // getDsrMeterSalesURL
    getDsrMeterSalesPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDsrMeterSalesURL, body, {
            headers: headers
        })
    }

    // getTankDSRDetailURL
    getTankDSRDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTankDSRDetailURL, body, {
            headers: headers
        })
    }

    // getAllKitNoURL
    getAllKitNoPOST(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllKitNoURL, {
            headers: headers
        })
    }

    // getAllEntityDetailsURL
    getAllEntityDetailsPOST(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllEntityDetailsURL, {
            headers: headers
        })
    }

    // aadFastagEntityDetailURL
    aadFastagEntityDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.aadFastagEntityDetailURL, body, {
            headers: headers
        })
    }

    // updateFastagEntityDetailURL
    updateFastagEntityDetailPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateFastagEntityDetailURL, body, {
            headers: headers
        })
    }

    // getAllEntityIdURL
    getAllEntityIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllEntityIdURL, body, {
            headers: headers
        })
    }

    // getRechargeForFastagURL
    getRechargeForFastagPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRechargeForFastagURL, body, {
            headers: headers
        })
    }

    // getcustmerIdByEntityIdURL
    getcustmerIdByEntityIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getcustmerIdByEntityIdURL, body, {
            headers: headers
        })
    }

    // getCoinDataMonthWiseURL
    getCoinDataMonthWisePOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCoinDataMonthWiseURL, body, {
            headers: headers
        })
    }

    // getTranslogForFastagURL
    getTranslogForFastagPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTranslogForFastagURL, body, {
            headers: headers
        })
    }

    // getredeemCoinMonthWiseURL
    getredeemCoinMonthWisePOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getredeemCoinMonthWiseURL, body, {
            headers: headers
        })
    }

    // addRedeemCoinURL
    addRedeemCoinPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addRedeemCoinURL, body, {
            headers: headers
        })
    }

    // getRedeemInfoByCustomerIdURL
    getRedeemInfoByCustomerIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getRedeemInfoByCustomerIdURL, body, {
            headers: headers
        })
    }

    // getCorporateDetailsForFastagPost
    getCorporateDetailsForFastagPost(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getCorporateDetailsForFastagURL, {
            headers: headers
        })
    }

    // serchPhoneForFastagURL
    searchPhoneForFuelDealerPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.serchPhoneForFastagURL, body, {
            headers: headers
        })
    }

    // userRegisterURL
    userRegister(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.userRegisterURL, body, {
            headers: headers
        })
    }

    // postAddressUrl
    addAddress(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.postAddressUrl, body, {
            headers: headers
        })
    }

    // addCorporateUrl
    addCorporate(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCorporateUrl, body, {
            headers: headers
        })
    }

    // getCorporateByIdUrl
    postCorporateById(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporateByIdUrl, body, {
            headers: headers
        })
    }

    // PostCustomer
    addCustomer(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.PostCustomer, body, {
            headers: headers
        })
    }

    // updateVeelsPlusCorporateIdwithPermURL
    updateVeelsPlusCorporateIdwithPermPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateVeelsPlusCorporateIdwithPermURL, body, {
            headers: headers
        })
    }

    // addkycURL
    addKYC(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addkycURL, body, {
            headers: headers
        })
    }

    // findPhoneNumberURL
    findPhone(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.findPhoneNumberURL, body, {
            headers: headers
        })
    }

    // aadFastagDataURL
    aadFastagDataPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.aadFastagDataURL, body, {
            headers: headers
        })
    }

    // updateCorpFastagURL
    updateCorpFastagPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCorpFastagURL, body, {
            headers: headers
        })
    }

    // serchPhoneForFastagLQURL
    searchPhoneForFuelDealerLQPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.serchPhoneForFastagLQURL, body, {
            headers: headers
        })
    }

    // getCorporateDetailsForFastagLQURL
    getCorporateDetailsForFastagLQPost(): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getCorporateDetailsForFastagLQURL, {
            headers: headers
        })
    }

    // aadFastagDataLQURL
    aadFastagDataLQPost(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.aadFastagDataLQURL, body, {
            headers: headers
        })
    }

    // getCorpWalletDetailsByEntityURL
    getCorpWalletDetailsByEntityPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorpWalletDetailsByEntityURL, body, {
            headers: headers
        })
    }

    // addCorpWalletDetailsURL
    addCorpWalletDetailsPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCorpWalletDetailsURL, body, {
            headers: headers
        })
    }


    // getEntityCountByEntityIdURL
    getEntityCountByEntityIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getEntityCountByEntityIdURL, body, {
            headers: headers
        })
    }

    // getEntityIdAllLQURL
    getEntityIdAllLQPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getEntityIdAllLQURL, body, {
            headers: headers
        })
    }

    // getEntityCountByEntityIdLQURL
    getEntityCountByEntityIdLQPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getEntityCountByEntityIdLQURL, body, {
            headers: headers
        })
    }

    // getAllCoinConversionByCustomerIdLockedURL
    getAllCoinConversionByCustomerIdLockedPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCoinConversionByCustomerIdLockedURL, body, {
            headers: headers
        })
    }

    // addCoinDetailsByPassURL
    addCoinDetailsByPassPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCoinDetailsByPassURL, body, {
            headers: headers
        })
    }

    // getAllVehicleListURL
    getAllVehicleListPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.get(this.getAllVehicleListURL, {
            headers: headers
        })
    }

    // getSerialNumberURL
    getSerialNumberPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getSerialNumberURL, body, {
            headers: headers
        })
    }

    // getAllKitNoByPersonIdURL
    getAllKitNoByPersonIdPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllKitNoByPersonIdURL, body, {
            headers: headers
        })
    }

    // ReplaceTagURL
    ReplaceTagPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.ReplaceTagURL, body, {
            headers: headers
        })
    }

    // uprepFastagURL
    uprepFastagPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.uprepFastagURL, body, {
            headers: headers
        })
    }

    // updatekitBarCodeMapURL
    updatekitBarCodeMapPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updatekitBarCodeMapURL, body, {
            headers: headers
        })
    }

    // updateTagURL
    updateTagPOST(body: object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateTagURL, body, {
            headers: headers
        })
    }












}
