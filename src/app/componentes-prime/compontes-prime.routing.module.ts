import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponentesPrimeComponent } from './componentes-prime.component';


import { AuthenticationGuardService } from '@cnj/uikit';

const routes: Routes = [
  {path: '', component: ComponentesPrimeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentesPrimeRoutingModule { }
