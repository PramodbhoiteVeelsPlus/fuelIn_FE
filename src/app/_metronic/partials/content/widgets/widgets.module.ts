import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
// Advanced Tables
import { AdvanceTablesWidget1Component } from './advance-tables/advance-tables-widget1/advance-tables-widget1.component';
import { AdvanceTablesWidget2Component } from './advance-tables/advance-tables-widget2/advance-tables-widget2.component';
import { AdvanceTablesWidget3Component } from './advance-tables/advance-tables-widget3/advance-tables-widget3.component';
import { AdvanceTablesWidget4Component } from './advance-tables/advance-tables-widget4/advance-tables-widget4.component';
import { AdvanceTablesWidget12Component } from './advance-tables/advance-tables-widget12/advance-tables-widget12.component';
import { AdvanceTablesWidget13Component } from './advance-tables/advance-tables-widget13/advance-tables-widget13.component';
// Base Tables
import { BaseTablesWidget1Component } from './base-tables/base-tables-widget1/base-tables-widget1.component';
import { BaseTablesWidget2Component } from './base-tables/base-tables-widget2/base-tables-widget2.component';
import { BaseTablesWidget6Component } from './base-tables/base-tables-widget6/base-tables-widget6.component';
// Lists
import { ListsWidget1Component } from './lists/lists-widget1/lists-widget1.component';
import { ListsWidget3Component } from './lists/lists-widget3/lists-widget3.component';
import { ListsWidget4Component } from './lists/lists-widget4/lists-widget4.component';
import { ListsWidget8Component } from './lists/lists-widget8/lists-widget8.component';
// Mixed
import { MixedWidget1Component } from './mixed/mixed-widget1/mixed-widget1.component';
import { MixedWidget4Component } from './mixed/mixed-widget4/mixed-widget4.component';
import { MixedWidget6Component } from './mixed/mixed-widget6/mixed-widget6.component';
import { MixedWidget10Component } from './mixed/mixed-widget10/mixed-widget10.component';
import { MixedWidget11Component } from './mixed/mixed-widget11/mixed-widget11.component';
// Tiles
import { TilesWidget1Component } from './tiles/tiles-widget1/tiles-widget1.component';
import { TilesWidget2Component } from './tiles/tiles-widget2/tiles-widget2.component';
import { TilesWidget3Component } from './tiles/tiles-widget3/tiles-widget3.component';
import { TilesWidget4Component } from './tiles/tiles-widget4/tiles-widget4.component';
import { TilesWidget5Component } from './tiles/tiles-widget5/tiles-widget5.component';
import { TilesWidget6Component } from './tiles/tiles-widget6/tiles-widget6.component';
import { TilesWidget7Component } from './tiles/tiles-widget7/tiles-widget7.component';
import { TilesWidget8Component } from './tiles/tiles-widget8/tiles-widget8.component';
import { TilesWidget9Component } from './tiles/tiles-widget9/tiles-widget9.component';
import { TilesWidget10Component } from './tiles/tiles-widget10/tiles-widget10.component';
import { TilesWidget11Component } from './tiles/tiles-widget11/tiles-widget11.component';
import { TilesWidget12Component } from './tiles/tiles-widget12/tiles-widget12.component';
import { TilesWidget13Component } from './tiles/tiles-widget13/tiles-widget13.component';
import { TilesWidget14Component } from './tiles/tiles-widget14/tiles-widget14.component';
// Other
import { DropdownMenusModule } from '../dropdown-menus/dropdown-menus.module';
import { NgbActiveModal, NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ListsWidget2Component } from './lists/lists-widget2/lists-widget2.component';
import { ListsWidget5Component } from './lists/lists-widget5/lists-widget5.component';
import { ListsWidget6Component } from './lists/lists-widget6/lists-widget6.component';
import { ListsWidget7Component } from './lists/lists-widget7/lists-widget7.component';
import { ChartsWidget1Component } from './charts/charts-widget1/charts-widget1.component';
import { ChartsWidget2Component } from './charts/charts-widget2/charts-widget2.component';
import { ChartsWidget3Component } from './charts/charts-widget3/charts-widget3.component';
import { ChartsWidget4Component } from './charts/charts-widget4/charts-widget4.component';
import { ChartsWidget5Component } from './charts/charts-widget5/charts-widget5.component';
import { ChartsWidget6Component } from './charts/charts-widget6/charts-widget6.component';
import { ChartsWidget7Component } from './charts/charts-widget7/charts-widget7.component';
import { ChartsWidget8Component } from './charts/charts-widget8/charts-widget8.component';
import { FeedsWidget1Component } from './feeds/feeds-widget1/feeds-widget1.component';
import { FeedsWidget2Component } from './feeds/feeds-widget2/feeds-widget2.component';
import { FeedsWidget3Component } from './feeds/feeds-widget3/feeds-widget3.component';
import { FeedsWidget4Component } from './feeds/feeds-widget4/feeds-widget4.component';
import { FeedsWidget5Component } from './feeds/feeds-widget5/feeds-widget5.component';
import { FeedsWidget6Component } from './feeds/feeds-widget6/feeds-widget6.component';
import { MixedWidget2Component } from './mixed/mixed-widget2/mixed-widget2.component';
import { MixedWidget3Component } from './mixed/mixed-widget3/mixed-widget3.component';
import { MixedWidget5Component } from './mixed/mixed-widget5/mixed-widget5.component';
import { MixedWidget7Component } from './mixed/mixed-widget7/mixed-widget7.component';
import { MixedWidget8Component } from './mixed/mixed-widget8/mixed-widget8.component';
import { MixedWidget9Component } from './mixed/mixed-widget9/mixed-widget9.component';
import { StatsWidget1Component } from './stats/stats-widget1/stats-widget1.component';
import { StatsWidget2Component } from './stats/stats-widget2/stats-widget2.component';
import { StatsWidget3Component } from './stats/stats-widget3/stats-widget3.component';
import { StatsWidget4Component } from './stats/stats-widget4/stats-widget4.component';
import { StatsWidget5Component } from './stats/stats-widget5/stats-widget5.component';
import { StatsWidget6Component } from './stats/stats-widget6/stats-widget6.component';
import { TablesWidget1Component } from './tables/tables-widget1/tables-widget1.component';
import { TablesWidget2Component } from './tables/tables-widget2/tables-widget2.component';
import { TablesWidget3Component } from './tables/tables-widget3/tables-widget3.component';
import { TablesWidget4Component } from './tables/tables-widget4/tables-widget4.component';
import { TablesWidget5Component } from './tables/tables-widget5/tables-widget5.component';
import { TablesWidget6Component } from './tables/tables-widget6/tables-widget6.component';
import { TablesWidget7Component } from './tables/tables-widget7/tables-widget7.component';
import { TablesWidget8Component } from './tables/tables-widget8/tables-widget8.component';
import { TablesWidget9Component } from './tables/tables-widget9/tables-widget9.component';
import { TablesWidget10Component } from './tables/tables-widget10/tables-widget10.component';
import { TablesWidget11Component } from './tables/tables-widget11/tables-widget11.component';
import { TablesWidget12Component } from './tables/tables-widget12/tables-widget12.component';
import { TablesWidget13Component } from './tables/tables-widget13/tables-widget13.component';
import { TablesWidget14Component } from './tables/tables-widget14/tables-widget14.component';
// new
import { CardsWidget1Component } from './_new/cards/cards-widget1/cards-widget1.component';
import { CardsWidget2Component } from './_new/cards/cards-widget2/cards-widget2.component';
import { CardsWidget20Component } from './_new/cards/cards-widget20/cards-widget20.component';
import { CardsWidget17Component } from './_new/cards/cards-widget17/cards-widget17.component';
import { ListsWidget26Component } from './_new/lists/lists-widget26/lists-widget26.component';
import { EngageWidget10Component } from './_new/engage/engage-widget10/engage-widget10.component';
import { CardsWidget7Component } from './_new/cards/cards-widget7/cards-widget7.component';
import { NewChartsWidget8Component } from './_new/charts/new-charts-widget8/new-charts-widget8.component';
import { CardsWidget18Component } from './_new/cards/cards-widget18/cards-widget18.component';
import { SharedModule } from "../../../shared/shared.module";
import { ModalsModule } from '../../layout/modals/modals.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from 'src/app/pages/excel.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TablesWidget15Component } from './tables/tables-widget15/tables-widget15.component';
import { TablesWidget16Component } from './tables/tables-widget16/tables-widget16.component';
import { TablesWidget17Component } from './tables/tables-widget17/tables-widget17.component';
import { TablesWidget18Component } from './tables/tables-widget18/tables-widget18.component';
import { StatsWidget7Component } from './stats/stats-widget7/stats-widget7.component';
import { StatsWidget8Component } from './stats/stats-widget8/stats-widget8.component';
import { StatsWidget9Component } from './stats/stats-widget9/stats-widget9.component';
import { TablesWidget19Component } from './tables/tables-widget19/tables-widget19.component';
import { TablesWidget20Component } from './tables/tables-widget20/tables-widget20.component';
import { TablesWidget21Component } from './tables/tables-widget21/tables-widget21.component';
import { TablesWidget22Component } from './tables/tables-widget22/tables-widget22.component';
import { TablesWidget23Component } from './tables/tables-widget23/tables-widget23.component';
import { TablesWidget24Component } from './tables/tables-widget24/tables-widget24.component';
import { TablesWidget25Component } from './tables/tables-widget25/tables-widget25.component';
import { RouterModule } from '@angular/router';
import { StatsWidget10Component } from './stats/stats-widget10/stats-widget10.component';
import { StatsWidget11Component } from './stats/stats-widget11/stats-widget11.component';
import { StatsWidget12Component } from './stats/stats-widget12/stats-widget12.component';
import { TablesWidget26Component } from './tables/tables-widget26/tables-widget26.component';
import { TablesWidget27Component } from './tables/tables-widget27/tables-widget27.component';
import { TablesWidget28Component } from './tables/tables-widget28/tables-widget28.component';
import { TablesWidget29Component } from './tables/tables-widget29/tables-widget29.component';
import { StatsWidget13Component } from './stats/stats-widget13/stats-widget13.component';
import { StatsWidget14Component } from './stats/stats-widget14/stats-widget14.component';
import { AdvanceTablesWidget5Component } from './advance-tables/advance-tables-widget5/advance-tables-widget5.component';
import { AdvanceTablesWidget6Component } from './advance-tables/advance-tables-widget6/advance-tables-widget6.component';
import { StatsWidget15Component } from './stats/stats-widget15/stats-widget15.component';
import { AdvanceTablesWidget7Component } from './advance-tables/advance-tables-widget7/advance-tables-widget7.component';
import { AdvanceTablesWidget8Component } from './advance-tables/advance-tables-widget8/advance-tables-widget8.component';
import { AdvanceTablesWidget9Component } from './advance-tables/advance-tables-widget9/advance-tables-widget9.component';
import { AdvanceTablesWidget10Component } from './advance-tables/advance-tables-widget10/advance-tables-widget10.component';
import { AdvanceTablesWidget11Component } from './advance-tables/advance-tables-widget11/advance-tables-widget11.component';
import { StatsWidget16Component } from './stats/stats-widget16/stats-widget16.component';
import { StatsWidget17Component } from './stats/stats-widget17/stats-widget17.component';
import { TablesWidget30Component } from './tables/tables-widget30/tables-widget30.component';
import { TablesWidget31Component } from './tables/tables-widget31/tables-widget31.component';
import { TablesWidget32Component } from './tables/tables-widget32/tables-widget32.component';
import { TablesWidget33Component } from './tables/tables-widget33/tables-widget33.component';
import { MixedWidget12Component } from './mixed/mixed-widget12/mixed-widget12.component';
import { MixedWidget13Component } from './mixed/mixed-widget13/mixed-widget13.component';
import { MixedWidget14Component } from './mixed/mixed-widget14/mixed-widget14.component';
import { BaseTablesWidget3Component } from './base-tables/base-tables-widget3/base-tables-widget3.component';
import { BaseTablesWidget4Component } from './base-tables/base-tables-widget4/base-tables-widget4.component';
import { BaseTablesWidget5Component } from './base-tables/base-tables-widget5/base-tables-widget5.component';
import { FeedsWidget7Component } from './feeds/feeds-widget7/feeds-widget7.component';
import { FeedsWidget8Component } from './feeds/feeds-widget8/feeds-widget8.component';
import { FeedsWidget9Component } from './feeds/feeds-widget9/feeds-widget9.component';
import { BaseTablesWidget7Component } from './base-tables/base-tables-widget7/base-tables-widget7.component';
import { BaseTablesWidget8Component } from './base-tables/base-tables-widget8/base-tables-widget8.component';
import { BaseTablesWidget9Component } from './base-tables/base-tables-widget9/base-tables-widget9.component';
import { BaseTablesWidget10Component } from './base-tables/base-tables-widget10/base-tables-widget10.component';
import { BaseTablesWidget11Component } from './base-tables/base-tables-widget11/base-tables-widget11.component';
import { BaseTablesWidget12Component } from './base-tables/base-tables-widget12/base-tables-widget12.component';
import { MixedWidget15Component } from './mixed/mixed-widget15/mixed-widget15.component';
import { BaseTablesWidget13Component } from './base-tables/base-tables-widget13/base-tables-widget13.component';
import { ListsWidget9Component } from './lists/lists-widget9/lists-widget9.component';
import { ListsWidget10Component } from './lists/lists-widget10/lists-widget10.component';
import { ListsWidget11Component } from './lists/lists-widget11/lists-widget11.component';
import { ListsWidget12Component } from './lists/lists-widget12/lists-widget12.component';
import { ListsWidget13Component } from './lists/lists-widget13/lists-widget13.component';
import { ListsWidget14Component } from './lists/lists-widget14/lists-widget14.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ListsWidget15Component } from './lists/lists-widget15/lists-widget15.component';
import { FeedsWidget10Component } from './feeds/feeds-widget10/feeds-widget10.component';
import { FeedsWidget11Component } from './feeds/feeds-widget11/feeds-widget11.component';
import { FeedsWidget12Component } from './feeds/feeds-widget12/feeds-widget12.component';
import { FeedsWidget13Component } from './feeds/feeds-widget13/feeds-widget13.component';
import { FeedsWidget14Component } from './feeds/feeds-widget14/feeds-widget14.component';
import { ChartsWidget9Component } from './charts/charts-widget9/charts-widget9.component';
import { ChartsWidget10Component } from './charts/charts-widget10/charts-widget10.component';
import { ChartsWidget11Component } from './charts/charts-widget11/charts-widget11.component';
import { ChartsWidget12Component } from './charts/charts-widget12/charts-widget12.component';
import { ChartsWidget13Component } from './charts/charts-widget13/charts-widget13.component';
import { ChartsWidget14Component } from './charts/charts-widget14/charts-widget14.component';
import { ChartsWidget15Component } from './charts/charts-widget15/charts-widget15.component';
import { AdvanceTablesWidget14Component } from './advance-tables/advance-tables-widget14/advance-tables-widget14.component';
import { AdvanceTablesWidget15Component } from './advance-tables/advance-tables-widget15/advance-tables-widget15.component';
import { PumpTablesWidget1Component } from './pump-tables/pump-tables-widget1/pump-tables-widget1.component';
import { PumpTablesWidget2Component } from './pump-tables/pump-tables-widget2/pump-tables-widget2.component';
import { PumpTablesWidget3Component } from './pump-tables/pump-tables-widget3/pump-tables-widget3.component';
import { PumpTablesWidget4Component } from './pump-tables/pump-tables-widget4/pump-tables-widget4.component';
import { PumpTablesWidget5Component } from './pump-tables/pump-tables-widget5/pump-tables-widget5.component';
import { PumpTablesWidget6Component } from './pump-tables/pump-tables-widget6/pump-tables-widget6.component';
import { PumpTablesWidget7Component } from './pump-tables/pump-tables-widget7/pump-tables-widget7.component';
import { PumpTablesWidget8Component } from './pump-tables/pump-tables-widget8/pump-tables-widget8.component';
import { PumpTablesWidget9Component } from './pump-tables/pump-tables-widget9/pump-tables-widget9.component';
import { PumpTablesWidget10Component } from './pump-tables/pump-tables-widget10/pump-tables-widget10.component';
import { ArchwizardModule } from 'angular-archwizard';
import { PumpTablesWidget11Component } from './pump-tables/pump-tables-widget11/pump-tables-widget11.component';
import { NgxPrintModule } from 'ngx-print';
import { BaseTablesWidget14Component } from './base-tables/base-tables-widget14/base-tables-widget14.component';
import { PumpTablesWidget12Component } from './pump-tables/pump-tables-widget12/pump-tables-widget12.component';
import { TransTablesWidget1Component } from './trans-tables/trans-tables-widget1/trans-tables-widget1.component';
import { TransTablesWidget2Component } from './trans-tables/trans-tables-widget2/trans-tables-widget2.component';
import { TransTablesWidget3Component } from './trans-tables/trans-tables-widget3/trans-tables-widget3.component';
import { TransTablesWidget4Component } from './trans-tables/trans-tables-widget4/trans-tables-widget4.component';
import { TransTablesWidget5Component } from './trans-tables/trans-tables-widget5/trans-tables-widget5.component';
import { TransTablesWidget6Component } from './trans-tables/trans-tables-widget6/trans-tables-widget6.component';
import { TransTablesWidget7Component } from './trans-tables/trans-tables-widget7/trans-tables-widget7.component';
import { TransTablesWidget8Component } from './trans-tables/trans-tables-widget8/trans-tables-widget8.component';
import { TransTablesWidget9Component } from './trans-tables/trans-tables-widget9/trans-tables-widget9.component';
import { TransTablesWidget10Component } from './trans-tables/trans-tables-widget10/trans-tables-widget10.component';
import { TransTablesWidget11Component } from './trans-tables/trans-tables-widget11/trans-tables-widget11.component';
import { TransTablesWidget12Component } from './trans-tables/trans-tables-widget12/trans-tables-widget12.component';
// import { routes } from 'src/app/app-routing.module';
@NgModule({
  declarations: [
    // Advanced Tables
    AdvanceTablesWidget1Component,
    AdvanceTablesWidget2Component,
    AdvanceTablesWidget3Component,
    AdvanceTablesWidget4Component,
    AdvanceTablesWidget12Component,
    AdvanceTablesWidget13Component,
    // Base Tables
    BaseTablesWidget1Component,
    BaseTablesWidget2Component,
    BaseTablesWidget6Component,
    // Lists
    ListsWidget1Component,
    ListsWidget3Component,
    ListsWidget4Component,
    ListsWidget8Component,
    // Mixed
    MixedWidget1Component,
    MixedWidget4Component,
    MixedWidget6Component,
    MixedWidget10Component,
    MixedWidget11Component,
    // Tiles,
    TilesWidget1Component,
    TilesWidget2Component,
    TilesWidget3Component,
    TilesWidget4Component,
    TilesWidget5Component,
    TilesWidget6Component,
    TilesWidget7Component,
    TilesWidget8Component,
    TilesWidget9Component,
    TilesWidget10Component,
    TilesWidget11Component,
    TilesWidget12Component,
    TilesWidget13Component,
    TilesWidget14Component,
    // Other
    ListsWidget2Component,
    ListsWidget5Component,
    ListsWidget6Component,
    ListsWidget7Component,
    ChartsWidget1Component,
    ChartsWidget2Component,
    ChartsWidget3Component,
    ChartsWidget4Component,
    ChartsWidget5Component,
    ChartsWidget6Component,
    ChartsWidget7Component,
    ChartsWidget8Component,

    //Feeds
    FeedsWidget1Component,
    FeedsWidget2Component,
    FeedsWidget3Component,
    FeedsWidget4Component,
    FeedsWidget5Component,
    FeedsWidget6Component,
    FeedsWidget7Component,
    FeedsWidget8Component,
    FeedsWidget9Component,

    MixedWidget2Component,
    MixedWidget3Component,
    MixedWidget5Component,
    MixedWidget7Component,
    MixedWidget8Component,
    MixedWidget9Component,
    StatsWidget1Component,
    StatsWidget2Component,
    StatsWidget3Component,
    StatsWidget4Component,
    StatsWidget5Component,
    StatsWidget6Component,
    StatsWidget7Component,
    StatsWidget8Component,
    StatsWidget9Component,
    TablesWidget1Component,
    TablesWidget2Component,
    TablesWidget3Component,
    TablesWidget4Component,
    TablesWidget5Component,
    TablesWidget6Component,
    TablesWidget7Component,
    TablesWidget8Component,
    TablesWidget9Component,
    TablesWidget10Component,
    TablesWidget11Component,
    TablesWidget12Component,
    TablesWidget13Component,
    TablesWidget14Component,
    CardsWidget1Component,
    CardsWidget2Component,
    CardsWidget20Component,
    CardsWidget17Component,
    ListsWidget26Component,
    EngageWidget10Component,
    CardsWidget7Component,
    NewChartsWidget8Component,
    CardsWidget18Component,
    TablesWidget15Component,
    TablesWidget16Component,
    TablesWidget17Component,
    TablesWidget18Component,
    TablesWidget19Component,
    TablesWidget20Component,
    TablesWidget21Component,
    TablesWidget22Component,
    TablesWidget23Component,
    TablesWidget24Component,
    TablesWidget25Component,
    StatsWidget10Component,
    StatsWidget11Component,
    StatsWidget12Component,
    TablesWidget26Component,
    TablesWidget27Component,
    TablesWidget28Component,
    TablesWidget29Component,
    StatsWidget13Component,
    StatsWidget14Component,
    AdvanceTablesWidget5Component,
    AdvanceTablesWidget6Component,
    StatsWidget15Component,
    AdvanceTablesWidget7Component,
    AdvanceTablesWidget8Component,
    AdvanceTablesWidget9Component,
    AdvanceTablesWidget10Component,
    AdvanceTablesWidget11Component,
    StatsWidget16Component,
    StatsWidget17Component,
    TablesWidget30Component,
    TablesWidget31Component,
    TablesWidget32Component,
    TablesWidget33Component,
    MixedWidget12Component,
    MixedWidget13Component,
    MixedWidget14Component,
    BaseTablesWidget3Component,
    BaseTablesWidget4Component,
    BaseTablesWidget5Component,
    BaseTablesWidget7Component,
    BaseTablesWidget8Component,
    BaseTablesWidget9Component,
    BaseTablesWidget10Component,
    BaseTablesWidget11Component,
    BaseTablesWidget12Component,
    MixedWidget15Component,
    BaseTablesWidget13Component,
    ListsWidget9Component,
    ListsWidget10Component,
    ListsWidget11Component,
    ListsWidget12Component,
    ListsWidget13Component,
    ListsWidget14Component,
    ListsWidget15Component,
    FeedsWidget10Component,
    FeedsWidget11Component, 
    FeedsWidget12Component,
    FeedsWidget13Component,
    FeedsWidget14Component,
    ChartsWidget9Component,
    ChartsWidget10Component,
    ChartsWidget11Component,
    ChartsWidget12Component,
    ChartsWidget13Component,
    ChartsWidget14Component,
    ChartsWidget15Component,
    AdvanceTablesWidget14Component,
    AdvanceTablesWidget15Component,
    PumpTablesWidget1Component,
    PumpTablesWidget2Component,
    PumpTablesWidget3Component,
    PumpTablesWidget4Component,
    PumpTablesWidget5Component,
    PumpTablesWidget6Component,
    PumpTablesWidget7Component,
    PumpTablesWidget8Component,
    PumpTablesWidget9Component,
    PumpTablesWidget10Component,
    PumpTablesWidget11Component,
    BaseTablesWidget14Component,
    PumpTablesWidget12Component,
    TransTablesWidget1Component,
    TransTablesWidget2Component,
    TransTablesWidget3Component,
    TransTablesWidget4Component,
    TransTablesWidget5Component,
    TransTablesWidget6Component,
    TransTablesWidget7Component,
    TransTablesWidget8Component, 
    TransTablesWidget9Component,
    TransTablesWidget10Component,
    TransTablesWidget11Component,
    TransTablesWidget12Component
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DropdownMenusModule,
    InlineSVGModule,
    NgApexchartsModule,
    NgbDropdownModule,
    SharedModule,
    ModalsModule,
    FormsModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgxPaginationModule,
    RouterModule,
    NgbNavModule,
    NgxSliderModule,
    NgxPrintModule,
    NgbAlertModule
  ],
  exports: [
    // Advanced Tables
    AdvanceTablesWidget1Component,
    AdvanceTablesWidget2Component,
    AdvanceTablesWidget3Component,
    AdvanceTablesWidget4Component,
    AdvanceTablesWidget12Component,
    AdvanceTablesWidget13Component,
    // Base Tables
    BaseTablesWidget1Component,
    BaseTablesWidget2Component,
    BaseTablesWidget6Component,
    // Lists
    ListsWidget1Component,
    ListsWidget3Component,
    ListsWidget4Component,
    ListsWidget8Component,
    // Mixed
    MixedWidget1Component,
    MixedWidget4Component,
    MixedWidget6Component,
    MixedWidget10Component,
    MixedWidget11Component,
    // Tiles,
    TilesWidget1Component,
    TilesWidget2Component,
    TilesWidget3Component,
    TilesWidget4Component,
    TilesWidget5Component,
    TilesWidget6Component,
    TilesWidget7Component,
    TilesWidget8Component,
    TilesWidget9Component,
    TilesWidget10Component,
    TilesWidget11Component,
    TilesWidget12Component,
    TilesWidget13Component,
    TilesWidget14Component,
    // Other
    ListsWidget2Component,
    ListsWidget5Component,
    ListsWidget6Component,
    ListsWidget7Component,
    ChartsWidget1Component,
    ChartsWidget2Component,
    ChartsWidget3Component,
    ChartsWidget4Component,
    ChartsWidget5Component,
    ChartsWidget6Component,
    ChartsWidget7Component,
    ChartsWidget8Component,

    FeedsWidget1Component,
    FeedsWidget2Component,
    FeedsWidget3Component,
    FeedsWidget4Component,
    FeedsWidget5Component,
    FeedsWidget6Component,
    FeedsWidget7Component,
    FeedsWidget8Component,
    FeedsWidget9Component,

    MixedWidget2Component,
    MixedWidget3Component,
    MixedWidget5Component,
    MixedWidget7Component,
    MixedWidget8Component,
    MixedWidget9Component,
    StatsWidget1Component,
    StatsWidget2Component,
    StatsWidget3Component,
    StatsWidget4Component,
    StatsWidget5Component,
    StatsWidget6Component,
    StatsWidget7Component,
    StatsWidget8Component,
    StatsWidget9Component,
    TablesWidget1Component,
    TablesWidget2Component,
    TablesWidget3Component,
    TablesWidget4Component,
    TablesWidget5Component,
    TablesWidget6Component,
    TablesWidget7Component,
    TablesWidget8Component,
    TablesWidget9Component,
    TablesWidget10Component,
    TablesWidget11Component,
    TablesWidget12Component,
    TablesWidget13Component,
    TablesWidget14Component,
    // new
    CardsWidget1Component,
    CardsWidget2Component,
    CardsWidget20Component,
    CardsWidget17Component,
    ListsWidget26Component,
    EngageWidget10Component,
    CardsWidget7Component,
    NewChartsWidget8Component,
    CardsWidget18Component,
    TablesWidget15Component,
    TablesWidget16Component,
    TablesWidget17Component,
    TablesWidget18Component,
    TablesWidget19Component,
    TablesWidget20Component,
    TablesWidget21Component,
    TablesWidget22Component,
    TablesWidget23Component,
    TablesWidget24Component,
    TablesWidget25Component,
    StatsWidget10Component,
    StatsWidget11Component,
    StatsWidget12Component,
    TablesWidget26Component,
    TablesWidget27Component,
    TablesWidget28Component,
    TablesWidget29Component,
    StatsWidget13Component,
    StatsWidget14Component,
    AdvanceTablesWidget5Component,
    AdvanceTablesWidget6Component,
    StatsWidget15Component,
    AdvanceTablesWidget7Component,
    AdvanceTablesWidget8Component,
    AdvanceTablesWidget9Component,
    AdvanceTablesWidget10Component,
    AdvanceTablesWidget11Component,
    StatsWidget16Component,
    StatsWidget17Component,
    TablesWidget30Component,
    TablesWidget31Component,
    TablesWidget32Component,
    TablesWidget33Component,
    MixedWidget12Component,
    MixedWidget13Component,
    MixedWidget14Component,
    BaseTablesWidget3Component,
    BaseTablesWidget4Component,
    BaseTablesWidget5Component,
    BaseTablesWidget7Component,
    BaseTablesWidget8Component,
    BaseTablesWidget9Component,
    BaseTablesWidget10Component,
    BaseTablesWidget11Component,
    BaseTablesWidget12Component,
    MixedWidget15Component,
    BaseTablesWidget13Component,
    ListsWidget9Component,
    ListsWidget10Component,
    ListsWidget11Component,
    ListsWidget12Component,
    ListsWidget13Component,
    ListsWidget14Component,
    ListsWidget15Component,
    FeedsWidget10Component,
    FeedsWidget11Component,
    FeedsWidget12Component,
    FeedsWidget13Component,
    FeedsWidget14Component,
    ChartsWidget9Component,
    ChartsWidget10Component,
    ChartsWidget11Component,
    ChartsWidget12Component,
    ChartsWidget13Component,
    ChartsWidget14Component,
    ChartsWidget15Component,
    AdvanceTablesWidget14Component,
    AdvanceTablesWidget15Component,
    PumpTablesWidget1Component,
    PumpTablesWidget2Component,
    PumpTablesWidget3Component,
    PumpTablesWidget4Component,
    PumpTablesWidget5Component,
    PumpTablesWidget6Component,
    PumpTablesWidget7Component,
    PumpTablesWidget8Component,
    PumpTablesWidget9Component,
    PumpTablesWidget10Component,
    PumpTablesWidget11Component,
    BaseTablesWidget14Component,
    PumpTablesWidget12Component,
    TransTablesWidget1Component,
    TransTablesWidget2Component,
    TransTablesWidget3Component,
    TransTablesWidget4Component,
    TransTablesWidget5Component,
    TransTablesWidget6Component,
    TransTablesWidget7Component,
    TransTablesWidget8Component,
    TransTablesWidget9Component,
    TransTablesWidget10Component,
    TransTablesWidget11Component,
    TransTablesWidget12Component
  ],
  providers: [NgbActiveModal, ExcelService],
})
export class WidgetsModule { }
