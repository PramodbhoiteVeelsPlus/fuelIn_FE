import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent implements OnInit {
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  currentDateStr: string = new Date().getFullYear().toString();

  constructor() {}

  ngOnInit(): void {}
}
