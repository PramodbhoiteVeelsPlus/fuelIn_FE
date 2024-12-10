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

  constructor(private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fuelDealerId = localStorage.getItem("dealerId");
    this.getGraphDataByDealerId(this.fuelDealerId)
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
          this.spinner.hide();
          this.cd.detectChanges();
        } else {
          this.spinner.hide();
        }
      })
  }
}
