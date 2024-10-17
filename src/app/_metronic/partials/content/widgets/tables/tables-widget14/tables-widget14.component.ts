import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetService } from '../../widgets.services';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

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
  selector: 'app-tables-widget14',
  templateUrl: './tables-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget14Component implements OnInit {

  filterForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    phoneNumber: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    city: new FormControl(""),
    state: new FormControl(""),
    role: new FormControl(""),
    androidId: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  })
  userData: any = [];
  modalReference: any;
  closeResult: string;
  searchTerm: any;
  userSearchData: any = [];
  searchBoxEmp: FormControl = new FormControl();
  title: "EMPLOYEE";

  constructor(
    private modalService: NgbModal,
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    this.filterForm.controls['role'].setValue("Sale/Marketing")
    this.getAllEmployee()
  }

  //openEmp
  openEmp(addEmp: any) {
    this.modalReference = this.modalService.open(addEmp, { size: 'lg' })
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submit() {
    this.spinner.show()
    let data = {
      userMobile: this.filterForm.value.phoneNumber,
      userName: this.filterForm.value.firstName + ' ' + this.filterForm.value.lastName,
      userRole: this.filterForm.value.role,
      // userPassword: "1000000000", 
      userAbout: "Veelsplus Admin",
      userCity: this.filterForm.value.city,
      userState: this.filterForm.value.state,
      userAndroidId: ''
    }
    // console.log(data)
    this.post.addUserPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        alert(res.msg)
        this.clear()
        this.close()
        this.getAllEmployee()
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.spinner.hide()
      }
    })
  }

  clear() {
    this.filterForm.reset()
  }

  getAllEmployee() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAllCRMEmployee(data).subscribe(res => {
        if (res.status == "OK") {
          this.userData = res.data;
          this.userSearchData = res.data;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.show()
      let data = {

      }
      this.post.getAllCRMEmployee(data).subscribe(res => {
        if (res.status == "OK") {
          this.userData = res.data;
          this.userSearchData = res.data;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
    }
  }

  close() {
    this.modalReference.close('close');
  }

  searchEmp() {
    this.searchBoxEmp.valueChanges
      // .distinctUntilChanged()
      .subscribe((term: any) => {
        this.searchTerm = term;
        this.searchEmployee();
      })
  }

  searchEmployee() {
    let term = this.searchTerm;

    this.userData = this.userSearchData.filter(function (res: { userName: string | any[]; }) {
      return res.userName.indexOf(term) >= 0;
    });

    if (this.userData.length == 0) {
      term = this.searchTerm;
      this.userData = this.userSearchData.filter(function (res: { userCRMId: string | any[]; }) {
        return res.userCRMId.indexOf(term) >= 0;
      });
    }

    if (this.userData.length == 0) {
      term = this.searchTerm;
      this.userData = this.userSearchData.filter(function (res: { userMobile: string | any[]; }) {
        return res.userMobile.indexOf(term) >= 0;
      });
    }

    if (this.userData.length == 0) {
      term = this.searchTerm;
      this.userData = this.userSearchData.filter(function (res: { userRole: string | any[]; }) {
        return res.userRole.indexOf(term) >= 0;
      });
    }

    if (this.userData.length == 0) {
      term = this.searchTerm;
      this.userData = this.userSearchData.filter(function (res: { userCity: string | any[]; }) {
        return res.userCity.indexOf(term) >= 0;
      });
    }

    if (this.userData.length == 0) {
      term = this.searchTerm;
      this.userData = this.userSearchData.filter(function (res: { userState: string | any[]; }) {
        return res.userState.indexOf(term) >= 0;
      });
    }
  }


  exportExcel(): void {
    let fileName = 'Employee.xlsx';

    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);

  }

  pdfDownload() {

    var cols = [["Emp CRM Id", "Mapped Date", "Employee Name", "Contact Number", "Role", "City, State"]];
    var rows = [];
    for (var key in this.userData) {

      var temp = [
        this.userData[key].userCRMId,
        moment(this.userData[key].userCreatedAt).format("DD-MM-YYYY"),
        this.userData[key].userName,
        this.userData[key].userMobile,
        this.userData[key].userRole,
        this.userData[key].userCity + "," + this.userData[key].userState,

      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');


    doc.setFontSize(12);
    doc.text(" Employee ", 350, 35);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 150 },
        2: { cellWidth: 150 },
        3: { cellWidth: 100 },
        4: { cellWidth: 90 },
        5: { cellWidth: 150 },
      },

      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data: any) => { },
    });

    doc.save("Employee.pdf");


  }

}
