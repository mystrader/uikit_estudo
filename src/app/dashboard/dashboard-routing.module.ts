import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthenticationGuardService } from '@cnj/uikit';

const routes: Routes = [
  {path: '', component: DashboardComponent, data: { id: 1 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
