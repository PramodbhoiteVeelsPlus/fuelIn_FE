import { ChangeDetectorRef, Component } from '@angular/core';
import { ListWidgetService } from '../listWidget.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component {

  array: any[]
  fuelDealerId: any;
  topFiveOs: any = [];

  constructor(private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fuelDealerId = localStorage.getItem("dealerId");
    this.topFiveOs = JSON.parse(localStorage.getItem("topFiveOs") || '{}');
    if (!this.topFiveOs.length) {
      this.getGraphDataByDealerId(this.fuelDealerId);
    } else {
      this.getGraphDataByDealerId1(this.fuelDealerId);
    }
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
    this.post.getTopFiveAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.array = res.data;
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
    this.post.getTopFiveAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.array = res.data;
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
