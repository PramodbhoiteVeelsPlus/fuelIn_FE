import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ListWidgetService {
    type1: string;
    cashBillId: any;
    date: any;
    setDate: string;
    setRoute: string;
    address: string;
    shiftTimeId: any;
    startDate: string;
    endDate: string;

    addCreditLubeReqByDealerForTaxPost(data: { lubeAllData: any; lubricantsFuelDealerCustomerMapId: any; reqQuantity: any; reqCreditAmount: any; estimatedRefuelDate: string; fuelDealerId: any; lubricantsFuelCorporateId: any; creditSource: string; PANno: any; lubricantsTransDateTime: string; lubricantsTransactionTime: string; creditAmount: any; transactionStatus: string; fuelDealerStaffId: any; actualCreditQuantity: any; createdAt: string; productRate: string | null | undefined; vehicleNumber: any; manualCrNumber: any; personId: any; managerVPPersonId: any; managerPersonId: any; managerName: any; }) {
        throw new Error('Method not implemented.');
    }

    constructor(private http: HttpClient,
        private router: Router
    ) { }


    header: any;
    user: any;
    token: any = "";


    public baseURL = environment.apiUrl;


    ///// API path

    private getTopFiveAccByFuelDealerIdURL = this.baseURL + 'crCustomers/getTopFiveAccByFuelDealerId';
    private updateCompanyGSTURL = this.baseURL + 'fuelDealerCustMap/updateCompanyGST';
    private addCreditLubeReqByDealerForTaxURL = this.baseURL + 'fuelLube/addCreditLubeReqByDealerForTax';
    private updateLastCRDateByMapIdURL = this.baseURL + 'fuelVendor/updateLastCRDateByMapId';
    private getLubeTaxDetailsByDealerIdURL = this.baseURL + 'fuelLube/getLubeTaxDetailsByDealerId';
    private comparePasswordURL = this.baseURL + 'fuelCreditInvoice/comparePassword';
    private cancelFuelCreditReqURL = this.baseURL + 'fuelDealerCustMap/cancelFuelCreditReq';
    private getCashBillURL = this.baseURL + 'cashBillInvoice/getCashBill';
    private getCustomerByCustomerIdURL = this.baseURL + 'customer/getCustomerBycustomerId';
    private getLubeTaxBillURL = this.baseURL + 'fuelLube/getLubeTaxBill';
    private getShiftOngoingDetailsByDealerIdURL = this.baseURL + 'shiftList/getShiftOngoingDetailsByDealerId';
    private getShiftDetailsByShiftIdURL = this.baseURL + 'shiftList/getShiftDetailsByShiftId';
    private checkOperatorShiftURL = this.baseURL + 'shiftList/checkOperatorShift';
    private getOperatorVPIdURL = this.baseURL + 'shiftList/getOperatorVPId';
    private startShiftFromPORATALURL = this.baseURL + 'shiftList/startShiftFromPORATAL';
    private getInfraDetailsByShiftIdURL = this.baseURL + 'shiftList/getInfraDetailsByShiftId';
    private closeShiftFromPORTALURL = this.baseURL + 'shiftList/closeShiftFromPORTAL';
    private getAllAttendantsByDidURL = this.baseURL + 'tripReports/getAllAttendantsByDid';
    private getFuelShiftTimeDetailsURL = this.baseURL + 'fuelShiftTime/getFuelShiftTimeDetails';
    private deleteShiftByShiftIdURL = this.baseURL + 'shiftList/deleteShiftByShiftId';
    private getMETERSALESTotalDSRURL = this.baseURL + 'shiftList/getMETERSALESTotalDSR';
    private getShiftVStallyByDateURL = this.baseURL + 'shiftList/getShiftVStallyByDate';
    private getShiftWiseBookDetailsURL = this.baseURL + 'shiftBook/getShiftWiseBookDetails';
    private getProductWiseDSRURL = this.baseURL + 'shiftList/getProductWiseDSR';
    private getDigitalTotalByDateURL = this.baseURL + 'shiftList/getDigitalTotalByDate';
    private getTotalCreditSalesPaymentByDayURL = this.baseURL + 'shiftList/getTotalCreditSalesPaymentByDay';
    private getFuelCreditByDateURL = this.baseURL + 'shiftList/getFuelCreditByDate';
    private getFuelCreditPaymentByDateURL = this.baseURL + 'shiftList/getFuelCreditPaymentByDate';
    private updateShiftTimeURL = this.baseURL + 'shiftList/updateShiftTime';
    private getPumpNozzleByDealerIdURL = this.baseURL + 'shiftList/getPumpNozzleByDealerId';
    private updateShiftInfraDetailsURL = this.baseURL + 'shiftList/updateShiftInfraDetails';
    private deleteNzEntryURL = this.baseURL + 'shiftList/deleteNzEntry';
    private getProductByInfraMapIdURL = this.baseURL + 'shiftList/getProductByInfraMapId';
    private addNozzelForShiftURL = this.baseURL + 'shiftList/addNozzelForShift';
    private getDigitalSalesByShiftURL = this.baseURL + 'shiftList/getDigitalSalesByShift';
    private getAllFuelCreditByStaffIdDateURL = this.baseURL + 'shiftList/getAllFuelCreditByStaffIdDate';
    private getCASHHandoverByShiftSQLURL = this.baseURL + 'shiftList/getCASHHandoverByShiftSQL';
    private removeTransactionLogURL = this.baseURL + 'accounttransaclog/removeTransactionLog';
    private getDigitalLubeURL = this.baseURL + "shiftList/getDigitalLube";
    private updateShiftPOSDigitalPaymentURL = this.baseURL + 'shiftList/updateShiftPOSDigitalPayment';
    private getTerminalTypeFromTerminalIdURL = this.baseURL + 'fuelTerminals/getTerminalTypeFromTerminalId';
    private getFuelTerminal1URL = this.baseURL + 'fuelTerminals/getFuelTerminal1';
    private submitDigitalSalesDetailsURL = this.baseURL + 'shiftList/submitDigitalSalesDetails';
    private getCorporateInfoByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelDealerCustMap/getCorporateInfoByfuelDealerCustomerMapId1';
    private getFuelCreditRequestByfuelDealerIdByDateURL = this.baseURL + 'fuelDealerCustMap/getFuelCreditRequestByfuelDealerIdByDate';
    private getLubeTransactionByfuelDealerIdByDateURL = this.baseURL + 'fuelDealerCustMap/getLubeTransactionByfuelDealerIdByDate';
    private calOutstandingAmountforAllURL = this.baseURL + 'fuelCreditInvoice/calOutstandingAmountforAll';
    private getfuelCreditVehicleByfuelDealerCustomerMapIdURL = this.baseURL + 'fuelVehicleDetails/getfuelCreditVehicleByfuelDealerCustomerMapId';
    private getCorporatesAllMappedRequestByDealerURL = this.baseURL + 'fuelDealerCustMap/getCorporatesAllMappedRequestByDealer';
    private getLubricantByIdURL = this.baseURL + 'lubricants/getLubricantById'
    private submitDigitalLubeDetailsURL = this.baseURL + "shiftList/submitDigitalLubeDetails";
    private deleteCashBillURL = this.baseURL + "cashBillInvoice/deleteCashBill";
    private submitCashSalesDetailsURL = this.baseURL + 'accounttransaclog/submitCashSalesDetails';
    private addLubeTaxCashBillURL = this.baseURL + 'cashBillInvoice/addLubeTaxCashBill';
    private getPriceByDealerProductIdByDateURL = this.baseURL + 'fuelPrice/getPriceByDealerProductIdByDate';
    private VehicleByRegistrationNumberURL = this.baseURL + 'vehicle/searchVehicleByRegistrationNumber';
    private addCreditSalesByOperatorURL = this.baseURL + 'fuelDealerCustMap/addCreditSalesByOperator';
    private updateLastCRDateMapIdWiseURL = this.baseURL + 'fuelVendor/updateLastCRDateMapIdWise';
    private addCreditLubeGstFromShiftURL = this.baseURL + 'fuelLube/addCreditLubeGstFromShift';
    private updateShiftDetailsByShiftIdURL = this.baseURL + 'shiftList/updateShiftDetailsByShiftId';
    private addFuelShiftTallySalesURL = this.baseURL + 'shiftList/addFuelShiftTallySales';
    private deleteFuelShiftTimeDetailsURL = this.baseURL + 'fuelShiftTime/deleteFuelShiftTimeDetails';
    private addFuelShiftTimeDetailsURL = this.baseURL + 'fuelShiftTime/addFuelShiftTimeDetails';
    private updateFuelShiftTimeDetailsURL = this.baseURL + 'fuelShiftTime/updateFuelShiftTimeDetails';
    private findPhoneNumberURL = this.baseURL + 'register/findPhoneNumber';
    private checkStaffDetailsURL = this.baseURL + 'fuelVendor/checkStaffDetails';
    private fuelStaffRegisterURL = this.baseURL + 'fuelVendor/fuelStaffRegister';
    private addDealerStaffAccessURL = this.baseURL + 'userAccess/addDealerStaffAccess';
    private getStaffDetailsURL = this.baseURL + 'fuelStaff/getStaffDetails';
    private renewMappingStaffURL = this.baseURL + 'fuelStaff/renewMappingStaff';
    private updateMapStatusforStaffURL = this.baseURL + 'fuelStaff/updateMapStatusforStaff';
    private UpdateDealerStaffDetailsURL = this.baseURL + 'fuelStaff/UpdateDealerStaffDetails';
    private switchedToStaffURL = this.baseURL + 'userAccess/switchedToStaff';
    private transporterStaffRegisterURL = this.baseURL + 'fuelVendor/transporterStaffRegister';
    private getStaffDetailsForTransporterURL = this.baseURL + 'fuelStaff/getStaffDetailsForTransporter';
    private updateStafForTransporterURL = this.baseURL + 'fuelVendor/updateStafForTransporter';
    private updateMappingStatusForTransporterURL = this.baseURL + 'fuelVendor/updateMappingStatusForTransporter';
    private getAttendanceListURL = this.baseURL + 'attendance/getAttendanceList';
    private getAttendanceURL = this.baseURL + 'attendance/getAttendance';
    private deleteAttendanceURL = this.baseURL + 'attendance/deleteAttendance';
    private getStaffDetailsDataURL = this.baseURL + 'attendance/getStaffDetails';
    private addAttendanceURL = this.baseURL + 'attendance/addAttendance';
    private updateAttendanceURL = this.baseURL + 'attendance/updateAttendance';
    private getStaffDetailsForSalaryURL = this.baseURL + 'staffSalary/getStaffDetailsForSalary';
    private getStaffSalaryURL = this.baseURL + 'staffSalary/getStaffSalary';
    private addStaffSalaryURL = this.baseURL + 'staffSalary/addStaffSalary';
    private deleteStaffSalaryURL = this.baseURL + 'staffSalary/deleteStaffSalary';
    private updateStaffSalaryURL = this.baseURL + 'staffSalary/updateStaffSalary';
    private getShiftWiseBookQuantityDetailsURL = this.baseURL + 'shiftBook/getShiftWiseBookQuantityDetails';
    private getFuelProductIdByDealerIdURL = this.baseURL + 'fuelPrice/getFuelProductIdByDealerId';
    private getDayWiseQuantityShiftBookURL = this.baseURL + 'shiftList/getDayWiseQuantityShiftBook';
    private getDayWiseShiftBookURL = this.baseURL + 'shiftList/getDayWiseShiftBook';
    private getDayWiseShiftBookMIDURL = this.baseURL + 'shiftList/getDayWiseShiftBookMID';
    private getDayWiseShiftBookLASTURL = this.baseURL + 'shiftList/getDayWiseShiftBookLAST';
    private getShiftTimeWiseBookDetailsURL = this.baseURL + 'shiftBook/getShiftTimeWiseBookDetails';
    private getShiftTimeWiseBookQuantityDetailsURL = this.baseURL + 'shiftBook/getShiftTimeWiseBookQuantityDetails';
    private getOperatorWiseDetailsURL = this.baseURL + 'shiftBook/getOperatorWiseDetails';
    private getOperatorWiseQuantityDetailsURL = this.baseURL + 'shiftBook/getOperatorWiseQuantityDetails';







    setHeader() {
        this.token = JSON.parse(localStorage.getItem('authenticationToken') || '{}');

    }



    //////API Functions
    // getTopFiveAccByFuelDealerId
    getTopFiveAccByFuelDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTopFiveAccByFuelDealerIdURL, body, {
            headers: headers
        })
    }

    // updateCompanyGSTURL
    updateCompanyGSTPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateCompanyGSTURL, body, {
            headers: headers
        })
    }

    // addCreditLubeReqByDealerForTaxURL
    addCreditLubeReqByDealerForTaxPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditLubeReqByDealerForTaxURL, body, {
            headers: headers
        })
    }

    // updateLastCRDateByMapIdURL
    updateLastCRDateByMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateLastCRDateByMapIdURL, body, {
            headers: headers
        })
    }

    // getLubeTaxDetailsByDealerIdURL
    getLubeTaxDetailsByDealerId(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTaxDetailsByDealerIdURL, body, {
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

    setRoutingWithType1(type1: string, cashBillId: any) {
        this.type1 = type1;
        this.cashBillId = cashBillId;
    }

    setNavigate(date: string, Book: string) {
        this.setDate = date;
        this.setRoute = Book
    }

    setRoutingWithDate(date: any, address: string) {
        this.date = date;
        this.address = address;
        console.log("date", this.date, this.address)
    }

    setRoutingWithShiftTimeId(shiftTimeId: any, address: string, startDate: string, endDate: string) {
        this.shiftTimeId = shiftTimeId;
        this.address = address;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // getCashBillURL
    getCashBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCashBillURL, body, {
            headers: headers
        })
    }

    // getCustomerByCustomerIdURL
    getCustomerByCustomerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCustomerByCustomerIdURL, body, {
            headers: headers
        })
    }

    // getLubeTaxBillURL
    getLubeTaxBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTaxBillURL, body, {
            headers: headers
        })
    }

    // getShiftOngoingDetailsByDealerIdURL
    getShiftOngoingDetailsByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftOngoingDetailsByDealerIdURL, body, {
            headers: headers
        })
    }

    // getShiftDetailsByShiftIdURL
    getShiftDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftDetailsByShiftIdURL, body, {
            headers: headers
        })
    }

    // checkOperatorShiftURL
    checkOperatorShiftPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.checkOperatorShiftURL, body, {
            headers: headers
        })
    }

    // getOperatorVPIdURL
    getOperatorVPIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOperatorVPIdURL, body, {
            headers: headers
        })
    }

    // startShiftFromPORATALURL
    startShiftFromPORATALPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.startShiftFromPORATALURL, body, {
            headers: headers
        })
    }

    // getInfraDetailsByShiftIdURL
    getInfraDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getInfraDetailsByShiftIdURL, body, {
            headers: headers
        })
    }

    // closeShiftFromPORTALURL
    closeShiftFromPORTALPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.closeShiftFromPORTALURL, body, {
            headers: headers
        })
    }

    // getAllAttendantsByDidURL
    getAllAttendantsByDidPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllAttendantsByDidURL, body, {
            headers: headers
        })
    }

    // getFuelShiftTimeDetailsURL
    getFuelShiftTimeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelShiftTimeDetailsURL, body, {
            headers: headers
        })
    }

    // deleteShiftByShiftIdURL
    deleteShiftByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteShiftByShiftIdURL, body, {
            headers: headers
        })
    }

    // getMETERSALESTotalDSRURL
    getMETERSALESTotalDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getMETERSALESTotalDSRURL, body, {
            headers: headers
        })
    }

    // getShiftVStallyByDateURL
    getShiftVStallyByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftVStallyByDateURL, body, {
            headers: headers
        })
    }

    // getShiftWiseBookDetailsURL
    getShiftWiseBookDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftWiseBookDetailsURL, body, {
            headers: headers
        })
    }

    // getProductWiseDSRURL
    getProductWiseDSRPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductWiseDSRURL, body, {
            headers: headers
        })
    }

    // getDigitalTotalByDateURL
    getDigitalTotalByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalTotalByDateURL, body, {
            headers: headers
        })
    }

    // getTotalCreditSalesPaymentByDayURL
    getTotalCreditSalesPaymentByDayPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTotalCreditSalesPaymentByDayURL, body, {
            headers: headers
        })
    }

    // getFuelCreditByDateURL
    getFuelCreditByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditByDateURL, body, {
            headers: headers
        })
    }

    // getFuelCreditPaymentByDateURL
    getFuelCreditPaymentByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditPaymentByDateURL, body, {
            headers: headers
        })
    }

    // updateShiftTimeURL
    updateShiftTimePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateShiftTimeURL, body, {
            headers: headers
        })
    }

    // getPumpNozzleByDealerIdURL
    getPumpNozzleByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPumpNozzleByDealerIdURL, body, {
            headers: headers
        })
    }

    // updateShiftInfraDetailsURL
    updateShiftInfraDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateShiftInfraDetailsURL, body, {
            headers: headers
        })
    }

    // deleteNzEntryURL
    deleteNzEntryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteNzEntryURL, body, {
            headers: headers
        })
    }

    // getProductByInfraMapIdURL
    getProductByInfraMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getProductByInfraMapIdURL, body, {
            headers: headers
        })
    }

    // addNozzelForShiftURL
    addNozzelForShiftPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addNozzelForShiftURL, body, {
            headers: headers
        })
    }

    // getDigitalSalesByShiftURL
    getDigitalSalesByShiftPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalSalesByShiftURL, body, {
            headers: headers
        })
    }

    // getAllFuelCreditByStaffIdDateURL
    getAllFuelCreditByStaffIdDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAllFuelCreditByStaffIdDateURL, body, {
            headers: headers
        })
    }

    // getCASHHandoverByShiftSQLURL
    getCASHHandoverByShiftSQLPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCASHHandoverByShiftSQLURL, body, {
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

    // getDigitalLubeURL
    getDigitalLubePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDigitalLubeURL, body, {
            headers: headers
        })
    }

    // updateShiftPOSDigitalPaymentURL
    updateShiftPOSDigitalPaymentPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateShiftPOSDigitalPaymentURL, body, {
            headers: headers
        })
    }

    // getTerminalTypeFromTerminalIdURL
    getTerminalTypeFromTerminalIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getTerminalTypeFromTerminalIdURL, body, {
            headers: headers
        })
    }

    // getFuelTerminal1URL
    getFuelTerminal1POST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelTerminal1URL, body, {
            headers: headers
        })
    }

    // submitDigitalSalesDetailsURL
    submitDigitalSalesDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.submitDigitalSalesDetailsURL, body, {
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

    // getFuelCreditRequestByfuelDealerIdByDateURL
    getFuelCreditRequestByfuelDealerIdByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelCreditRequestByfuelDealerIdByDateURL, body, {
            headers: headers
        })
    }

    // getLubeTransactionByfuelDealerIdByDateURL
    getLubeTransactionByfuelDealerIdByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubeTransactionByfuelDealerIdByDateURL, body, {
            headers: headers
        })
    }

    // calOutstandingAmountforAllURL
    calOutstandingAmountforAllPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.calOutstandingAmountforAllURL, body, {
            headers: headers
        })
    }

    // getfuelCreditVehicleByfuelDealerCustomerMapIdURL
    getfuelCreditVehicleByfuelDealerCustomerMapIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getfuelCreditVehicleByfuelDealerCustomerMapIdURL, body, {
            headers: headers
        })
    }

    // getCorporatesAllMappedRequestByDealerURL
    getCorporatesAllMappedRequestByDealerPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getCorporatesAllMappedRequestByDealerURL, body, {
            headers: headers
        })
    }

    // getLubricantByIdURL
    getLubricantByIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getLubricantByIdURL, body, {
            headers: headers
        })
    }

    // submitDigitalLubeDetailsURL
    submitDigitalLubeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.submitDigitalLubeDetailsURL, body, {
            headers: headers
        })
    }

    // deleteCashBillURL
    deleteCashBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteCashBillURL, body, {
            headers: headers
        })
    }

    // submitCashSalesDetailsURL
    submitCashSalesDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.submitCashSalesDetailsURL, body, {
            headers: headers
        })
    }

    // addLubeTaxCashBillURL
    addLubeTaxCashBillPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addLubeTaxCashBillURL, body, {
            headers: headers
        })
    }

    // getPriceByDealerProductIdByDateURL
    getPriceByDealerProductIdByDatePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getPriceByDealerProductIdByDateURL, body, {
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

    // addCreditSalesByOperatorURL
    addCreditSalesByOperatorPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditSalesByOperatorURL, body, {
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

    // addCreditLubeGstFromShiftURL
    addCreditLubeGstFromShiftPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addCreditLubeGstFromShiftURL, body, {
            headers: headers
        })
    }

    // updateShiftDetailsByShiftIdURL
    updateShiftDetailsByShiftIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateShiftDetailsByShiftIdURL, body, {
            headers: headers
        })
    }

    // addFuelShiftTallySalesURL
    addFuelShiftTallySalesPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addFuelShiftTallySalesURL, body, {
            headers: headers
        })
    }

    // deleteFuelShiftTimeDetailsURL
    deleteFuelShiftTimeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteFuelShiftTimeDetailsURL, body, {
            headers: headers
        })
    }

    // addFuelShiftTimeDetailsURL
    addFuelShiftTimeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addFuelShiftTimeDetailsURL, body, {
            headers: headers
        })
    }

    // updateFuelShiftTimeDetailsURL
    updateFuelShiftTimeDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateFuelShiftTimeDetailsURL, body, {
            headers: headers
        })
    }

    // findPhoneNumberURL
    findPhoneNumberPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.findPhoneNumberURL, body, {
            headers: headers
        })
    }

    // checkStaffDetailsURL
    checkStaffDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.checkStaffDetailsURL, body, {
            headers: headers
        })
    }

    // fuelStaffRegisterURL
    fuelStaffRegisterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.fuelStaffRegisterURL, body, {
            headers: headers
        })
    }

    // addDealerStaffAccessURL
    addDealerStaffAccessPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addDealerStaffAccessURL, body, {
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

    // renewMappingStaffURL
    renewMappingStaffPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.renewMappingStaffURL, body, {
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

    // switchedToStaffURL
    switchedToStaffPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.switchedToStaffURL, body, {
            headers: headers
        })
    }

    // transporterStaffRegisterURL
    transporterStaffRegisterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.transporterStaffRegisterURL, body, {
            headers: headers
        })
    }

    // getStaffDetailsForTransporterURL
    getStaffDetailsForTransporterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffDetailsForTransporterURL, body, {
            headers: headers
        })
    }

    // updateStafForTransporterURL
    updateStafForTransporterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateStafForTransporterURL, body, {
            headers: headers
        })
    }

    // updateMappingStatusForTransporterURL
    updateMappingStatusForTransporterPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateMappingStatusForTransporterURL, body, {
            headers: headers
        })
    }

    // getAttendanceListURL
    getAttendanceListPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAttendanceListURL, body, {
            headers: headers
        })
    }

    // getAttendanceURL
    getAttendancePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getAttendanceURL, body, {
            headers: headers
        })
    }

    // deleteAttendanceURL
    deleteAttendancePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteAttendanceURL, body, {
            headers: headers
        })
    }

    // getStaffDetailsDataURL
    getStaffDetailsDataPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffDetailsDataURL, body, {
            headers: headers
        })
    }

    // addAttendanceURL
    addAttendancePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addAttendanceURL, body, {
            headers: headers
        })
    }

    // updateAttendanceURL
    updateAttendancePOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateAttendanceURL, body, {
            headers: headers
        })
    }

    // getStaffDetailsForSalaryURL
    getStaffDetailsForSalaryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffDetailsForSalaryURL, body, {
            headers: headers
        })
    }

    // getStaffSalaryURL
    getStaffSalaryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getStaffSalaryURL, body, {
            headers: headers
        })
    }

    // addStaffSalaryURL
    addStaffSalaryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.addStaffSalaryURL, body, {
            headers: headers
        })
    }

    // deleteStaffSalaryURL
    deleteStaffSalaryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.deleteStaffSalaryURL, body, {
            headers: headers
        })
    }

    // updateStaffSalaryURL
    updateStaffSalaryPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.updateStaffSalaryURL, body, {
            headers: headers
        })
    }

    // getShiftWiseBookQuantityDetailsURL
    getShiftWiseBookQuantityDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftWiseBookQuantityDetailsURL, body, {
            headers: headers
        })
    }

    // getFuelProductIdByDealerIdURL
    getFuelProductIdByDealerIdPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getFuelProductIdByDealerIdURL, body, {
            headers: headers
        })
    }

    // getDayWiseQuantityShiftBookURL
    getDayWiseQuantityShiftBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseQuantityShiftBookURL, body, {
            headers: headers
        })
    }

    // getDayWiseShiftBookURL
    getDayWiseShiftBookPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseShiftBookURL, body, {
            headers: headers
        })
    }

    // getDayWiseShiftBookMIDURL
    getDayWiseShiftBookMIDPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseShiftBookMIDURL, body, {
            headers: headers
        })
    }

    // getDayWiseShiftBookLASTURL
    getDayWiseShiftBookLASTPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getDayWiseShiftBookLASTURL, body, {
            headers: headers
        })
    }

    // getShiftTimeWiseBookDetailsURL
    getShiftTimeWiseBookDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftTimeWiseBookDetailsURL, body, {
            headers: headers
        })
    }

    // getShiftTimeWiseBookQuantityDetailsURL
    getShiftTimeWiseBookQuantityDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getShiftTimeWiseBookQuantityDetailsURL, body, {
            headers: headers
        })
    }

    // getOperatorWiseDetailsURL
    getOperatorWiseDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOperatorWiseDetailsURL, body, {
            headers: headers
        })
    }

    // getOperatorWiseQuantityDetailsURL
    getOperatorWiseQuantityDetailsPOST(body: Object): Observable<any> {
        this.setHeader();
        let headers = new HttpHeaders();
        headers = headers.set('authenticationToken', this.token);
        return this.http.post(this.getOperatorWiseQuantityDetailsURL, body, {
            headers: headers
        })
    }
}
