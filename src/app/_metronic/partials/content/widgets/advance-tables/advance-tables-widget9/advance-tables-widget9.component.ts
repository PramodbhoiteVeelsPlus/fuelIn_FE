import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { Adv_TablesService } from '../adv_tables.services';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';

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
  selector: 'app-advance-tables-widget9',
  templateUrl: './advance-tables-widget9.component.html',
  styleUrl: './advance-tables-widget9.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class AdvanceTablesWidget9Component {

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    entityId: new FormControl(""),
  });

  filterFormLQ = new FormGroup({ 
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    entityId: new FormControl(""),
  });

  allentityList: any = [];
  entityCountList: any = [];
  entityCount: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  allentityLQList: any;
  entityCountLQList: any = [];

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.getAllEntity();
    this.getAllLQEntity()
    this.cd.detectChanges();
  }

  getAllEntity(){
    this.spinner.show();
    let data = {

    }
    this.post.getAllEntityIdPOST(data)
    .subscribe(res=>{
      this.allentityList = res.data;
      this.spinner.hide();
    })

  }
  
  pageChangeEvent(event: number) {
    this.p = event;
    this.getEntityCount();
  }

  getEntityCount() {
    if(this.filterForm.value.entityId){
      this.entityCountList = []
      this.spinner.show();
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        entityId: this.filterForm.value.entityId
      }
      this.post.getEntityCountByEntityIdPOST(data)
        .subscribe(res => {  
          if (res.status == "OK") {
            this.entityCount = res;
          this.entityCountList = res.data
              this.spinner.hide();
          } else {
            alert(res.msg);
            this.spinner.hide();
          }     
        });
    }else{
    this.spinner.show();
    this.entityCountList = []
    let data = {
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getEntityCountByEntityIdPOST(data)
      .subscribe(res => {  
        if (res.status == "OK") {
          this.entityCount = res;
          this.entityCountList = res.data
            this.spinner.hide();
        } else {
          alert(res.msg);
          this.spinner.hide();
        }     
      });
    }
  }
  
getAllLQEntity(){
  this.spinner.show();
  let data = {

  }
  this.post.getEntityIdAllLQPOST(data)
  .subscribe(res=>{
    this.allentityLQList = res.data;
    this.spinner.hide();
  })

}

getEntityCountLQ() {
  if(this.filterFormLQ.value.entityId){
    this.entityCountLQList = []
    this.spinner.show();
    let data = {
      startDate: moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      entityId: this.filterFormLQ.value.entityId
    }
    this.post.getEntityCountByEntityIdLQPOST(data)
      .subscribe(res => {  
        if (res.status == "OK") {
        this.entityCountLQList = res.data
            this.spinner.hide();
        } else {
          alert(res.msg);
          this.spinner.hide();
        }     
      });
  }else{
  this.spinner.show();
  this.entityCountLQList = []
  let data = {
    startDate: moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    endDate: moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
  }
  this.post.getEntityCountByEntityIdLQPOST(data)
    .subscribe(res => {  
      if (res.status == "OK") {
        this.entityCountLQList = res.data
          this.spinner.hide();
      } else {
        alert(res.msg);
        this.spinner.hide();
      }     
    });
  }
}
}
