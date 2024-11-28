export class addAccountingArray {
    date: any;
    book : any = 'Expense'; 
    transactionType:any = '';
    details : any = ''; 
    paidTo:any = '';
    paidFrom:any = '';
    amount: number; 
    posFrom:any = '';
    inputFrom:any = '';
    inputTo:any = '';
    isAddRow: boolean = false;
    isRemoveRow: boolean = true;

    //Transaction Type
    isDefault: boolean = false;
    isOil: boolean = false;
    isBank: boolean = false;
    isCash: boolean = false;
    isPOS: boolean = false;
    isExpense: boolean = true;

    //Paid From
    isDefaultFrom: boolean = true;
    isOilAccFrom: boolean = false;
    isBankAccFrom: boolean = false;
    isInputBoxFrom: boolean = false;
    isLoanAccFrom: boolean = false;
    isCashAccFrom: boolean = false;
    isPOSAccFrom: boolean = false;
    isCashBankFrom: boolean = false;
    isExpenseAccFrom: boolean = false;

    //Paid To
    isDefaultTo: boolean = true;
    isOilAccTo: boolean = false;
    isBankAccTo: boolean = false;
    isInputBoxTo: boolean = false;
    isLoanAccTo: boolean = false;
    isCashAccTo: boolean = false;
    isPOSAccTo: boolean = false;
    isCashBankTo: boolean = false;
    isExpenseAccTo: boolean = false;

    accountingBankCr = 'FALSE';
    accountingBankDb = 'FALSE';
    accountingCashCr = 'FALSE';
    accountingCashDb = 'FALSE';
    accountingOilCoCr = 'FALSE';
    accountingOilCoDb = 'FALSE';
    accountingPOSDb = 'FALSE';
    accountingExpenseCr = 'FALSE';
    accountingLoanAccDb = 'FALSE';
    accountingLoanAccCr = 'FALS';

}