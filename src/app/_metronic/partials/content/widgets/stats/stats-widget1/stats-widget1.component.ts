import { Component, Injectable, Input, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


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
  selector: 'app-stats-widget1',
  templateUrl: './stats-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ] 
})
export class StatsWidget1Component {
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

  @Input() title = 'Employee';

  constructor() { }

  openEmp(_t11: TemplateRef<any>) {
    throw new Error('Method not implemented.');
  }
  getAllEmployee() {
    throw new Error('Method not implemented.');
  }
  searchEmp() {
    throw new Error('Method not implemented.');
  }
  exportExcel() {
    throw new Error('Method not implemented.');
  }
  pdfDownload() {
    throw new Error('Method not implemented.');
  }
  submit() {
    throw new Error('Method not implemented.');
  }
  clear() {
    throw new Error('Method not implemented.');
  }
}
