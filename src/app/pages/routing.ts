import { ViswasaModule } from './viswasa/viswasa.module';
import { Routes } from '@angular/router';
import { EmployeeComponent } from './user/employee/employee.component';
import { BusinessComponent } from './user/business/business.component';
import { FollowUpComponent } from './user/follow-up/follow-up.component';
import { LocationComponent } from './user/location/location.component';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'pumpDashboard',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'new_Viswasa',
    loadChildren: () => import('./new_viswasa/new_viswasa.module').then((m) => m.New_ViswasaModule),
  },
  {
    path: 'viswasa',
    loadChildren: () => import('./viswasa/viswasa.module').then((m) => m.ViswasaModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then((m) => m.onboardingModule),
  },
  {
    path: 'customerDetails',
    loadChildren: () => import('./customerDetails/customerDetails.module').then((m) => m.customerDetailsModule),
  },
  {
    path: 'credit',
    loadChildren: () => import('./dealer/credit/credit.module').then((m) => m.CreditModule),
  },
  {
    path: 'accounting',
    loadChildren: () => import('./dealer/accounting/accounting.module').then((m) => m.AccountingModule),
  },
  {
    path: 'report',
    loadChildren: () => import('./dealer/report/report.module').then((m) => m.ReportModule),
  },
  {
    path: 'dsr',
    loadChildren: () => import('./dealer/DSR/dsr.module').then((m) => m.DSRModule),
  },
  {
    path: 'shift',
    loadChildren: () => import('./dealer/shift/shift.module').then((m) => m.ShiftModule),
  },
  {
    path: 'inventory',
    loadChildren: () => import('./dealer/inventory/inventory.module').then((m) => m.InventoryModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
  
  {
    path: 'crm/employee',
    component: EmployeeComponent,
  },
  {
    path: 'crm/business',
    component: BusinessComponent,
  },
  {
    path: 'crm/followUp',
    component: FollowUpComponent,
  },
  {
    path: 'crm/location',
    component: LocationComponent,
  },
  {
    path: 'deleteModal',
    loadChildren: () => import('./delete-modal/delete-modal.module').then((m) => m.deleteModalModule),
  },
];

export { Routing };
