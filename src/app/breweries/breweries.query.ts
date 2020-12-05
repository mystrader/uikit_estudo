import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {BreweriesStore, BreweriesState} from './breweries.store';
import {Breweries} from './breweries.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreweriesQuery extends QueryEntity<BreweriesState, Breweries> {

  constructor(protected store: BreweriesStore) {
    super(store);
  }

  obterPagina(): number {
    return this.getValue().page;
  }

  obterPaginaAsObservable(): Observable<number> {
    return this.select(breweriesState => breweriesState.page);
  }

  obterTotalDeRegistros(): number {
    return this.getValue().total;
  }

  obterFiltros() {
    return this.getValue().filters;
  }

  obterFiltrosAsObservable() {
    return this.select(breweriesState => breweriesState.filters);
  }

  obterTotalDeRegistrosAsObservable(): Observable<number> {
    return this.select(breweriesState => breweriesState.total);
  }

  obterTotalPorPagina(): number {
    return this.getValue().pageSize;
  }

  obterTotalPorPaginaAsObservable(): Observable<number> {
    return this.select(breweriesState => breweriesState.pageSize);
  }

  obterOrdenacao() {
    return this.getValue().sort;
  }

  obterIdsSelecionados() {
    return this.getActiveId();
  }
}
