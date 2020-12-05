import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { ComponentesPrimeComponent } from './componentes-prime/componentes-prime.component';
import { AuthenticationGuardService } from '@cnj/uikit';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'breweries',
    loadChildren: './breweries/breweries.module#BreweriesModule',
    data: {
      breadcrumb: 'Breweries',
      icon: 'fa-lg fas fa-list-alt mat-icon-no-color',
    },
  },
  {
    path: 'prime',
    loadChildren:
      './componentes-prime/componentes-prime.module#ComponentesPrimeModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
