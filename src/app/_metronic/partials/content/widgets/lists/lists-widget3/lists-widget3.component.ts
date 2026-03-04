import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ListWidgetService } from '../listWidget.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartsService } from '../../charts/charts.services';

@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component {

  @Input() stats: any = [];
  array: any[]
  fuelDealerId: any;
  topFiveOs: any = [];

  constructor(private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private post1: ChartsService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fuelDealerId = localStorage.getItem("dealerId");
    this.topFiveOs = JSON.parse(localStorage.getItem("topFiveOs") || '{}');
    // if (!this.topFiveOs.length) {
    //   this.getGraphDataByDealerId(this.fuelDealerId);
    // } else {
    //   this.getGraphDataByDealerId1(this.fuelDealerId);
    // }
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
  }


  getGraphDataByDealerId(fuelDealerId: any) {
    this.spinner.show();
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getDealerDashboardCrDataPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.array = res.topFiveData;
          localStorage.setItem('topFiveOs', JSON.stringify(this.array));
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges();
        } else {
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges()
        }
      })
  }

  getGraphDataByDealerId1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getDealerDashboardCrDataPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.array = res.topFiveData;
          localStorage.setItem('topFiveOs', JSON.stringify(this.array));
          // this.spinner.hide();
          this.cd.detectChanges();
        } else {
          // this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }
}
