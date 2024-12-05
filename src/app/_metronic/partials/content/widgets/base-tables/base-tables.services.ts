import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class BaseTablesService {
    creditValueforInvoice: any = [];
    creditValueforInvoicePayment: any = [];
    setRouteForActiveArray: any = [];
    FCInvoiceListDetails: any = [];
    activeStartDate: any;
    activeEndDate: any;
    isCustomer: string;

    constructor(private http: HttpClient,
        private router: Router
    ) { }

    header: any;
    user: any;
    token: any = "";

    public baseURL = environment.apiUrl;

    //API PATH
    private getFuelCreditRequestCorporateByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestCorporateByfuelDealerId';
    private getFuelCreditRequestByfuelDealerIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerId';
    private getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1';
    private getFuelCreditRequestByCorporateIdAndFuelDealerURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByCorporateIdAndFuelDealer';
    private getFuelCreditByCorporateIdURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditByCorporateId';
    private comparePasswordURL = this.baseURL + 'fuelCreditInvoice/comparePassword';
    private cancelFuelCreditReqURL = this.baseURL + 'fuelDealerCustMap/cancelFuelCreditReq';
    private updateLastCRDateMapIdWiseURL = this.baseURL + 'fuelVendor/updateLastCRDateMapIdWise';
    private VehicleByRegistrationNumberURL = this.baseURL + 'vehicle/searchVehicleByRegistrationNumber';
    private updateCreditReqByDealerURL = this.baseURL + 'fuelDealerCustMap/editFuelCreditReqfuelCreditId';
    private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
    private getAllCRPaymentByCustNameDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCustNameDealer';
    private getAllCRPaymentByDealerURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByDealer';
    private getAllCRPaymentByCorporateURL = this.baseURL + 'accounttransaclog/getAllCRPaymentByCorporate';
    private removeTransactionLogURL = this.baseURL + 'accounttransaclog/removeTransactionLog';
    private getAllDealersListURL = this.baseURL + 'dealerDashboard/getAllDealersList';
    private updateAmountStatusByTranslogIdURL = this.baseURL + 'coinConversion/updateAmountStatusByTranslogId';
    private getCorporateInfoByCorporateCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByCorporateCustomerMapId';
    private getTransactionwiseLedgerByMapIdURL = this.baseURL + 'crCustomers/getTransactionwiseLedgerByMapId';
    private getDayWiseLedgerByMapIdURL = this.baseURL + 'crCustomers/getDayWiseLedger';
    private getMonthlyCrDetailsURL = this.baseURL + 'crCustomers/getMonthlyCrDetails';
    private getDayWiseLedgerQtyURL = this.baseURL + 'crCustomers/getDayWiseLedgerQty';
    private getMonthlyCrDetailsQtyURL = this.baseURL + 'crCustomers/getMonthlyCrDetailsQty';
    private getPreviousOutstandingByCustomerURL = this.baseURL + "fuelCreditInvoice/getPreviousOutstandingByCustomer";
    private getFuelCreditRequestPersonListByfuelDealerIdURL = this.baseURL + 'fuelCreditInvoice/getFuelCreditRequestPersonListByfuelDealerId';
    private allDiscountedAmountForManualURL = this.baseURL + "fuelCreditInvoice/allDiscountedAmountForManual";
    private getdataBycustomerMapIdURL = this.baseURL + "fuelDealerCustMap/getdataBycustomerMapId";
    private getManagerDetailsByDealerIdURL = this.baseURL + "fuelCreditInvoice/getManagerDetailsByDealerId";
    private addManagerMobileToDOCURL = this.baseURL + "fuelCreditInvoice/addManagerMobileToDOC";
    private getSelectedMobileNumberByDealerIdURL = this.baseURL + "fuelCreditInvoice/getSelectedMobileNumberByDealerId";
    private getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManualURL = this.baseURL + 'accounttransaclog/getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManual';
    private getOutstandingForSavedInvoiceByDateURL = this.baseURL + 'fuelCreditInvoice/getOutstandingForSavedInvoiceByDate';
    private addfuelInvoiceFuelAndPaymentURL = this.baseURL + "fuelCreditInvoice/addfuelInvoiceFuelAndPayment";
    private getAllSavedInvoiceListURL = this.baseURL + "fuelCreditInvoice/getAllSavedInvoiceList";
    private deleteInvoiceDataByInvoiceIdURL = this.baseURL + "fuelCreditInvoice/deleteInvoiceDataByInvoiceId";
    private getCreditPaymentForFuelInvoiceURL = this.baseURL + "fuelCreditInvoice/getCreditPaymentForFuelInvoice";
    private getFuelCorpIdByMapIdURL = this.baseURL + "fuelDealerCustMap/getFuelCorpIdByMapId";
    private calOutstandingAmountForSavedInvoiceURL = this.baseURL + "fuelCreditInvoice/getOpOutstandingByDateForSavedInvoice";
    private getTotalTransactionCreditPaymentForFuelInvoiceURL = this.baseURL + "fuelCreditInvoice/getTotalTransactionCreditPaymentForFuelInvoice";
    private getFuelInvoiceDataByInvoiceIdURL = this.baseURL + "fuelCreditInvoice/getFuelInvoiceDataByInvoiceId";
    private getLubricantTotalURL = this.baseURL + "lubricants/getLubricantTotal";
    private getCustomerDataByCorporateIdForSavedInvoiceURL = this.baseURL + "fuelCreditInvoice/getCustomerDataByCorporateIdForSavedInvoice";
    private getBankDetailsByDealerIdURL = this.baseURL + 'bankDetails/getBankDetailsByDealerId';
    private getCustomerDetailsByCrDaysLimitURL = this.baseURL + 'invoiceCrDaysLimit/getCustomerDetailsByCrDaysLimit';
    private getCrDaysLimitByDealerIdURL = this.baseURL + 'invoiceCrDaysLimit/getCrDaysLimitByDealerId'; 
    private addSavedInvoiceByCrDaysURL = this.baseURL + 'invoiceCrDaysLimit/addSavedInvoiceByCrDays';
    private getStaffDetailsURL = this.baseURL + 'fuelStaff/getStaffDetails';
    private updateMapStatusforStaffURL = this.baseURL + 'fuelStaff/updateMapStatusforStaff'; 
    private UpdateDealerStaffDetailsURL = this.baseURL + 'fuelStaff/UpdateDealerStaffDetails';



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

    // getFuelCreditRequestByfuelDealerIdURL
    getFuelCreditRequestByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestByfuelDealerIdURL, body, {
            headers: headers
        })
    }

    // getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL
    getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1POST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1URL, body, {
            headers: headers
        })
    }

    // getFuelCreditRequestByCorporateIdAndFuelDealerURL
    getFuelCreditRequestByCorporateIdAndFuelDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestByCorporateIdAndFuelDealerURL, body, {
            headers: headers
        })
    }

    // getFuelCreditByCorporateIdURL
    getFuelCreditByCorporateIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditByCorporateIdURL, body, {
            headers: headers
        })
    }

    // comparePasswordURL
    comparePasswordPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.comparePasswordURL, body, {
            headers: headers
        })
    }

    // cancelFuelCreditReqURL
    cancelFuelCreditReqPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.cancelFuelCreditReqURL, body, {
            headers: headers
        })
    }

    // updateLastCRDateMapIdWiseURL
    updateLastCRDateMapIdWisePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateMapIdWiseURL, body, {
            headers: headers
        })
    }

    // VehicleByRegistrationNumberURL
    VehicleByRegistrationNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.VehicleByRegistrationNumberURL, body, {
            headers: headers
        })
    }

    // updateCreditReqByDealerURL
    updateCreditReqByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCreditReqByDealerURL, body, {
            headers: headers
        })
    }

    // getCorporateInfoByfuelDealerCustomerMapIdURL
    getCorporateInfoByfuelDealerCustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporateInfoByfuelDealerCustomerMapIdURL, body, {
            headers: headers
        })
    }

    // getAllCRPaymentByCustNameDealerURL
    getAllCRPaymentByCustNameDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCRPaymentByCustNameDealerURL, body, {
            headers: headers
        })
    }

    // getAllCRPaymentByDealerURL
    getAllCRPaymentByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCRPaymentByDealerURL, body, {
            headers: headers
        })
    }

    // getAllCRPaymentByCorporateURL
    getAllCRPaymentByCorporatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllCRPaymentByCorporateURL, body, {
            headers: headers
        })
    }

    // removeTransactionLogURL
    removeTransactionLogPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.removeTransactionLogURL, body, {
            headers: headers
        })
    }

    // getAllDealersListURL
    getAllDealersListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllDealersListURL, body, {
            headers: headers
        })
    }

    // updateAmountStatusByTranslogIdURL
    updateAmountStatusByTranslogIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateAmountStatusByTranslogIdURL, body, {
            headers: headers
        })
    }

    // getCorporateInfoByCorporateCustomerMapIdURL
    getCorporateInfoByCorporateCustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporateInfoByCorporateCustomerMapIdURL, body, {
            headers: headers
        })
    }

    // getTransactionwiseLedgerByMapIdURL
    getTransactionwiseLedgerByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTransactionwiseLedgerByMapIdURL, body, {
            headers: headers
        })
    }

    // getDayWiseLedgerByMapIdURL
    getDayWiseLedgerByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseLedgerByMapIdURL, body, {
            headers: headers
        })
    }

    // getMonthlyCrDetailsURL
    getMonthlyCrDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMonthlyCrDetailsURL, body, {
            headers: headers
        })
    }

    // getDayWiseLedgerQtyURL
    getDayWiseLedgerQtyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseLedgerQtyURL, body, {
            headers: headers
        })
    }

    // getMonthlyCrDetailsQtyURL
    getMonthlyCrDetailsQtyPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMonthlyCrDetailsQtyURL, body, {
            headers: headers
        })
    }

    // getPreviousOutstandingByCustomerURL
    getPreviousOutstandingByCustomerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPreviousOutstandingByCustomerURL, body, {
            headers: headers
        })
    }

    // getFuelCreditRequestPersonListByfuelDealerIdURL
    getFuelCreditRequestPersonListByfuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestPersonListByfuelDealerIdURL, body, {
            headers: headers
        })
    }

    // allDiscountedAmountForManualURL
    allDiscountedAmountForManualPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.allDiscountedAmountForManualURL, body, {
            headers: headers
        })
    }

    // getdataBycustomerMapIdURL
    getdataBycustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getdataBycustomerMapIdURL, body, {
            headers: headers
        })
    }

    // getManagerDetailsByDealerIdURL
    getManagerDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getManagerDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // addManagerMobileToDOCURL
    addManagerMobileToDOCPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addManagerMobileToDOCURL, body, {
            headers: headers
        })
    }

    // getSelectedMobileNumberByDealerIdURL
    getSelectedMobileNumberByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getSelectedMobileNumberByDealerIdURL, body, {
            headers: headers
        })
    }

    // getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManualURL
    getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManualPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManualURL, body, {
            headers: headers
        })
    }

    // getOutstandingForSavedInvoiceByDateURL
    getOutstandingForSavedInvoiceByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOutstandingForSavedInvoiceByDateURL, body, {
            headers: headers
        })
    }

    // addfuelInvoiceFuelAndPaymentURL
    addfuelInvoiceFuelAndPaymentPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addfuelInvoiceFuelAndPaymentURL, body, {
            headers: headers
        })
    }

    // getAllSavedInvoiceListURL
    getAllSavedInvoiceListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllSavedInvoiceListURL, body, {
            headers: headers
        })
    }

    // deleteInvoiceDataByInvoiceIdURL
    deleteInvoiceDataByInvoiceIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteInvoiceDataByInvoiceIdURL, body, {
            headers: headers
        })
    }

    // getCreditPaymentForFuelInvoiceURL
    getCreditPaymentForFuelInvoicePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCreditPaymentForFuelInvoiceURL, body, {
            headers: headers
        })
    }

    // getFuelCorpIdByMapIdURL
    getFuelCorpIdByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCorpIdByMapIdURL, body, {
            headers: headers
        })
    }

    // calOutstandingAmountForSavedInvoiceURL
    calOutstandingAmountForSavedInvoicePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.calOutstandingAmountForSavedInvoiceURL, body, {
            headers: headers
        })
    }

    // getTotalTransactionCreditPaymentForFuelInvoiceURL
    getTotalTransactionCreditPaymentForFuelInvoicePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalTransactionCreditPaymentForFuelInvoiceURL, body, {
            headers: headers
        })
    }

    // getFuelInvoiceDataByInvoiceIdURL
    getFuelInvoiceDataByInvoiceIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelInvoiceDataByInvoiceIdURL, body, {
            headers: headers
        })
    }

    // getLubricantTotalURL
    getLubricantTotalPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubricantTotalURL, body, {
            headers: headers
        })
    }

    // getCustomerDataByCorporateIdForSavedInvoiceURL
    getCustomerDataByCorporateIdForSavedInvoicePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCustomerDataByCorporateIdForSavedInvoiceURL, body, {
            headers: headers
        })
    }

    // getBankDetailsByDealerIdURL
    getBankDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getBankDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getCustomerDetailsByCrDaysLimitURL
    getCustomerDetailsByCrDaysLimitPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCustomerDetailsByCrDaysLimitURL, body, {
            headers: headers
        })
    }

    // getCrDaysLimitByDealerIdURL
    getCrDaysLimitByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCrDaysLimitByDealerIdURL, body, {
            headers: headers
        })
    }

    // addSavedInvoiceByCrDaysURL
    addSavedInvoiceByCrDaysPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addSavedInvoiceByCrDaysURL, body, {
            headers: headers
        })
    }

    // getStaffDetailsURL
    getStaffDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffDetailsURL, body, {
            headers: headers
        })
    }

    // updateMapStatusforStaffURL
    updateMapStatusforStaffPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateMapStatusforStaffURL, body, {
            headers: headers
        })
    }

    // UpdateDealerStaffDetailsURL
    UpdateDealerStaffDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.UpdateDealerStaffDetailsURL, body, {
            headers: headers
        })
    }

    inilizeForInvoice() {
        this.creditValueforInvoice = []
    }

    inilizeForInvoicePayment() {
        this.creditValueforInvoicePayment = []
    }

    setRouteForSavedInvoice(FCInvoiceListDetails: any[], startDate: any, endDate: any, isCustomer: string) {
        this.setRouteForActiveArray.length = 0;
        this.FCInvoiceListDetails = FCInvoiceListDetails;
        this.activeStartDate = startDate;
        this.activeEndDate = endDate;
        this.isCustomer = isCustomer;
    }
}