import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Adv_TablesService } from 'src/app/_metronic/partials/content/widgets/advance-tables/adv_tables.services';
import * as XLSX  from 'xlsx';

@Component({
  selector: 'app-ft-vehicle',
  templateUrl: './ft-vehicle.component.html',
  styleUrl: './ft-vehicle.component.scss'
})
export class FtVehicleComponent {

  ftUserId: string;
  vehicleList: any = [];
  page: any = 1;
  pageSize: any = 10;
  arrayBuffer: any;
  rowNumber: any;
  show: boolean;
  ftVehicleList: any = [];
  vehicleNumber: any;
  entityID: any;
  vehicleNumberForSignzyUse: any;
  vistUserIdForSignzyUse: any;
  modalReference: any;
  closeResult: string;

  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id') || '';
    this.ftUserId = id;
    this.getFastagVehicleListByUserId()
  }

  getFastagVehicleListByUserId() {
    this.vehicleList = [];
    let data = {
      userId: this.ftUserId,
    }
    this.post.getFastagVehicleListByUserIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.vehicleList = res.data;
          this.entityID = res.data[0].entityId;
          this.cd.detectChanges();
        } else {
          alert("Data not found..")
          this.cd.detectChanges();
        }
      })
  }

  onExcelKitpload(event: Event): void {
    // const FILE = (event.target as HTMLInputElement).files[0];
    // let fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(FILE);
    // fileReader.onload = (e) => {
    //   this.arrayBuffer = fileReader.result;
    //   var data = new Uint8Array(this.arrayBuffer);
    //   var arr = new Array();
    //   for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    //   var bstr = arr.join("");
    //   var workbook = XLSX.read(bstr, { type: "binary" });
    //   var first_sheet_name = workbook.SheetNames[0];
    //   var worksheet = workbook.Sheets[first_sheet_name];
    //   var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    //   this.addkitBarCodeMapByExcel(arraylist)
    // }
    alert("Unable to Upload")
  }


  addkitBarCodeMapByExcel(excelfile: any) {
    let excelData = {
      excelfile: excelfile,
      vistUserId: this.ftUserId,
    }
    this.post.addVistVehicleByExcelPost(excelData)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg);
        } else {
          alert(res.msg);
        }
      })
  }

  getAllFastagVehicleListByVehicleNumber(vehicleNumber: any) {
    this.ftVehicleList = [];
    let data = {
      vehicleNumber: vehicleNumber,
    }
    this.post.getAllFTVehicleListByVehicleNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.ftVehicleList = res.data;
          this.cd.detectChanges();
        } else {
          alert("Data not found..")
          this.cd.detectChanges();
        }
      })
  }

  changeValue(i: any, vehicleNumber: any) {
    this.vehicleNumber = '';
    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
        this.cd.detectChanges();
      } else {
        this.show = true;
        this.rowNumber = i
        this.vehicleNumber = vehicleNumber
        this.getAllFastagVehicleListByVehicleNumber(vehicleNumber)
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.vehicleNumber = vehicleNumber
      this.getAllFastagVehicleListByVehicleNumber(vehicleNumber)
    }
  }
  open(contentOnBoard: any, vehicleNumber: any, vistUserId: any) {
    this.vehicleNumberForSignzyUse = vehicleNumber;
    this.vistUserIdForSignzyUse = vistUserId;
    this.modalReference = this.modalService.open(contentOnBoard)
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


  getInfoFromSignzy() {
    let data = {
      vehicleNumber: this.vehicleNumberForSignzyUse,
    }
    this.post.getVehicledataFromSignzyPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.getFastagVehicleListByUserId()
          alert(res.message)
        } else {
          alert(res.message)
        }
      })
  }


}
