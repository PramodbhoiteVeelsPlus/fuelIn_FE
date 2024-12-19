import { Component, OnInit, Input, Injectable, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { getCSSVariableValue } from '../../../../../kt/_utils';

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
  selector: 'app-trans-tables-widget3',
  templateUrl: './trans-tables-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget3Component implements OnInit {
  basicTrip = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  fuelDealerId: any;
  accessGroup: any;
  thisMonthYear = moment(new Date()).format("MMM y")
  lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
  corporateId: any;
  transporterCorpId: any;
  isPurchasePayment: boolean = false;
  crData: any = [];
  currentMonth: any;
  currentMonthPurchase: any;
  currentMonthPayment: any;
  lastMon: any;
  lastMonthPurchase: any;
  lastMonthPayment: any;
  graphData: any = [];
  month1: any;
  month2: any;
  month3: any;
  month4: any;
  month5: any;
  month6: any;
  os1: any = 0;
  os3: any = 0;
  os2: any = 0;
  os4: any = 0;
  os5: any = 0;
  os6: any = 0;
  purchase1: any = 0;
  purchase2: any = 0;
  purchase3: any = 0;
  purchase4: any = 0;
  purchase5: any = 0;
  purchase6: any = 0;
  payment1: any = 0;
  payment2: any = 0;
  payment3: any = 0;
  payment4: any = 0;
  payment5: any = 0;
  payment6: any = 0;
  chartOptions: any = {};
  months: any  = [];
  os: any  = [];
  purchase: any  = [];
  payment: any  = [];

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.accessGroup = element.accessGroupId
    this.corporateId = element.veelsPlusCorporateID;
    this.currentMonth = moment(new Date()).format("MMM")
    this.lastMon = moment(new Date()).subtract(1, 'month').format("MMM")
    this.getGraphDataByDealerId(this.transporterCorpId)
    this.cd.detectChanges()
  }

getGraphDataByDealerId(transporterCorpId: any) {
  this.spinner.show()
  let data = {
    fuelCorporateId: transporterCorpId,
  }
  this.post.getCreditDetailsByMonthPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        //Months
        this.graphData = res.data.reverse()
        console.log("dataG", this.graphData)
        if(this.graphData[5]){
          this.month1 = this.graphData[5].month;
        }
        if(this.graphData[4]){
          this.month2 = this.graphData[4].month;
        }
        if(this.graphData[3]){
          this.month3 = this.graphData[3].month;
        }
        if(this.graphData[2]){
          this.month4 = this.graphData[2].month;
        }
        if(this.graphData[1]){
          this.month5 = this.graphData[1].month;
        }
        if(this.graphData[0]){
          this.month6 = this.graphData[0].month;
        }
        
        // OS          
        if(this.graphData[5]){
          this.os1 = Number(this.graphData[5].totalOutstand).toFixed(0);
        }
        if(this.graphData[4]){
          this.os2 = Number(this.graphData[4].totalOutstand).toFixed(0);
        }
        if(this.graphData[3]){
          this.os3 = Number(this.graphData[3].totalOutstand).toFixed(0);
        }
        if(this.graphData[2]){
          this.os4 = Number(this.graphData[2].totalOutstand).toFixed(0);
        }
        if(this.graphData[1]){
          this.os5 = Number(this.graphData[1].totalOutstand).toFixed(0);
        }
        if(this.graphData[0]){
          this.os6 = Number(this.graphData[0].totalOutstand).toFixed(0);
        }

        // Purchase          
        if(this.graphData[5]){
          this.purchase1 = Number(this.graphData[5].purchase).toFixed(0);
        }
        if(this.graphData[4]){
          this.purchase2 = Number(this.graphData[4].purchase).toFixed(0);
        }
        if(this.graphData[3]){
          this.purchase3 = Number(this.graphData[3].purchase).toFixed(0);
        }
        if(this.graphData[2]){
          this.purchase4 = Number(this.graphData[2].purchase).toFixed(0);
        }
        if(this.graphData[1]){
          this.purchase5 = Number(this.graphData[1].purchase).toFixed(0);
        }
        if(this.graphData[0]){
          this.purchase6 = Number(this.graphData[0].purchase).toFixed(0);
        }

        // Payment          
        if(this.graphData[5]){
          this.payment1 = Number(this.graphData[5].payment).toFixed(0);
        }
        if(this.graphData[4]){
          this.payment2 = Number(this.graphData[4].payment).toFixed(0);
        }
        if(this.graphData[3]){
          this.payment3 = Number(this.graphData[3].payment).toFixed(0);
        }
        if(this.graphData[2]){
          this.payment4 = Number(this.graphData[2].payment).toFixed(0);
        }
        if(this.graphData[1]){
          this.payment5 = Number(this.graphData[1].payment).toFixed(0);
        }
        if(this.graphData[1]){
          this.payment6 = Number(this.graphData[1].payment).toFixed(0);
        }

        this.months = [this.month1, this.month2, this.month3, this.month4, this.month5, this.month6];
        this.os = [this.os1, this.os2, this.os3, this.os4, this.os5, this.os6];
        this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4, this.purchase5, this.purchase6];
        this.payment = [this.payment1, this.payment2, this.payment3, this.payment4, this.payment5, this.payment6];

        this.chartOptions = getChartOptions(350, this.months, this.os, this.purchase, this.payment);
        console.log("dataGra", this.chartOptions)
        this.spinner.hide();
        this.cd.detectChanges();
      } else {
        this.spinner.hide();
      }
    })
}

}

function getChartOptions(height: number, months: any, os: any, purchase: any, payment: any) {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  return {
    series: [
      {
        name: 'O/s',
        data: [os[0], os[1], os[2], os[3], os[4], os[5]],
      },
      {
        name: 'Sales',
        data: [purchase[0], purchase[1], purchase[2], purchase[3], purchase[4], purchase[5]],
      },
      {
        name: 'Payment',
        data: [payment[0], payment[1], payment[2], payment[3], payment[4], payment[5]],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      title: {
        text: 'Month'
      },
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: '₹'
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return '₹' + val;
        },
      },
    },
    colors: ['#F8285A', '#1B84FF', '#17C653'],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
