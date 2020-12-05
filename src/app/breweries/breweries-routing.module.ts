import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BreweriesDetailComponent} from './breweries-detail/breweries-detail.component';
import {BreweriesUpdateComponent} from './breweries-update/breweries-update.component';
import {BreweriesListComponent} from './breweries-list/breweries-list.component';

const routes: Routes = [
  {
    path: '',
    component: BreweriesListComponent,
  },
  {
    path: 'cadastrar',
    component: BreweriesUpdateComponent,
    data: { breadcrumb: 'Cadastrar', icon: 'fas fa-plus-square mat-icon-no-color' },
  },
  {
    path: ':breweriesId',
    data: { breadcrumb: ':breweriesId', icon: 'fas fa-info-circle mat-icon-no-color' },
    children: [
      {
        path: '',
        component: BreweriesDetailComponent,
      },
      {
        path: 'alterar',
        data: { breadcrumb: 'Alterar', icon: 'fas fa-pen-square mat-icon-no-color' },
        children: [
          {
            path: '',
            component: BreweriesUpdateComponent,
          },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreweriesRoutingModule { }
