import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// imports gerados depois
import { ComponentesPrimeComponent } from './componentes-prime.component';
import { ComponentesPrimeRoutingModule } from './compontes-prime.routing.module';


@NgModule({
  // 1.1 Declarar os componentes
  declarations: [ComponentesPrimeComponent],
  imports: [
    CommonModule,
    ComponentesPrimeRoutingModule

  ],
  // 2.2 Exportar os componentes
  exports: [ComponentesPrimeComponent]
})
export class ComponentesPrimeModule { }
