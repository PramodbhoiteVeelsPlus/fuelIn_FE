import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-stats-widget14',
  templateUrl: './stats-widget14.component.html',
  styleUrl: './stats-widget14.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget14Component {
  localStoragecorporateId: any;
  countUnAssign: any = 0;
  countAssignToPerson: any = 0;
  personId: any;
  userData: any = [];
  limit: any = 0;
  
  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    this.getCountUnAssignTag()
    this.getAllVeelsUser()
    this.cd.detectChanges();
  }
  
  
  getCountUnAssignTag(){
    let data = {
  
    }
    this.post.getCountUnAssignTagPOST(data)
    .subscribe(res=>{
      this.countUnAssign = res.data[0].NumberOfkitNotAssign
    })
  }
  
  getCountAssignTag(i: any){
    
    let data = {
      personId: this.personId
    }
    this.post.getCountAssignTagByPersonIdPOST(data)
    .subscribe(res=>{
      this.countAssignToPerson = res.data[0].NumberOfkitNotAssign
    })
  }
  
  getAllVeelsUser(){
    let data = {
  
    }
    this.post.getAllVeelsplusUserPOST(data)
    .subscribe(res=>{
      this.userData = res.data
    })
  }
  
  submitAssignTag(){
    let data = {
      personId:this.personId,
      limit:this.limit
    }
    this.post.assignKitNumberToPersonIdPOST(data)
    .subscribe(res=>{
      if(res.status=="OK"){
        alert(res.msg);
        this.getCountUnAssignTag();
      }
    })
  }
}

