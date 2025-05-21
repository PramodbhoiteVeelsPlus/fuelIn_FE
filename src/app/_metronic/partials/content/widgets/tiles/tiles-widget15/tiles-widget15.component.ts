import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PumpTablesService } from '../../pump-tables/pump-tables.services';
import { TilesService } from '../tiles.services';

@Component({
  selector: 'app-tiles-widget15',
  templateUrl: './tiles-widget15.component.html',
})
export class TilesWidget15Component {
  staffDetails: any = [];
  dealerList: any = [];

  constructor(
      private post: TilesService,
      private cd: ChangeDetectorRef,
      private spinner: NgxSpinnerService,
      private post1: PumpTablesService,
    ) {}

    
  ngOnInit(): void {
    this.getDealerList()
  }

  getDealerList(){
    this.spinner.show()
    let data = {

    }
    this.post.getVeelsIdPOST(data).subscribe(res => {
      if (res.status == "OK") {
        if(res.data.length){
          this.dealerList = res.data;
          this.spinner.hide();
        } else{
          this.spinner.hide();
          this.dealerList = [];
        }      
      }
    })
  }

  getDetailsByVeelsId(id:any){
    this.staffDetails = []
    if(id.target.value){
      this.spinner.show();
      let data = {
        FuelVeelsId: id.target.value,
      }
      this.post.getStaffDetailsByVEELSPOST(data).subscribe(res => {
        if (res.status == "OK") {
          if(res.data.length){
            this.staffDetails = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          }else{
            alert("Details not available..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }      
        }
      })
    }else{
      this.spinner.hide();
    }    
  }

}
