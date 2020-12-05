import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BreweriesUpdateComponent} from './breweries-update/breweries-update.component';
import {BreweriesListComponent} from './breweries-list/breweries-list.component';
import {BreweriesDetailComponent} from './breweries-detail/breweries-detail.component';
import {BreweriesViewerComponent} from './view-model/breweries-viewer/breweries-viewer.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BreweriesEditorComponent } from './view-model/breweries-editor/breweries-editor.component';
import {BreweriesRoutingModule} from './breweries-routing.module';

import {UikitComponentsModule} from '@cnj/uikit';
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {InputMaskModule} from "primeng/inputmask";
import {InputSwitchModule} from "primeng/inputswitch";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";

@NgModule({
  declarations: [
      BreweriesEditorComponent,
      BreweriesUpdateComponent,
      BreweriesListComponent,
      BreweriesViewerComponent,
      BreweriesDetailComponent],
  imports: [
    CommonModule,
    BreweriesRoutingModule,
    UikitComponentsModule,
    ReactiveFormsModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    PaginatorModule,
    ConfirmDialogModule,
  ],
  exports: [
      BreweriesEditorComponent,
      BreweriesUpdateComponent,
      BreweriesListComponent,
      BreweriesViewerComponent,
      BreweriesDetailComponent],
  providers: [ConfirmationService]
})
export class BreweriesModule { }
