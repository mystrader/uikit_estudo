import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig, MultiActiveState} from '@datorama/akita';
import {Breweries} from './breweries.model';

export interface BreweriesState extends EntityState<Breweries>, MultiActiveState {
  total: number;
  page: number;
  pageSize: number;
  filters: [];
  sort: { coluna: string; direcao: string; };
}

const initialState: BreweriesState = {
  active: [],
  total: 0,
  page: 0,
  pageSize: 5,
  filters: [],
  sort: {coluna: 'id', direcao: 'asc'},
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'Breweries' })
export class BreweriesStore extends EntityStore<BreweriesState, Breweries> {

  constructor() {
    super(initialState);
  }

  atualizarTotal(total: number) {
    this.update(state => ({
      ...state,
      total
    }));
  }

  atualizarFiltros(filters: []) {
    this.update(state => ({
      ...state,
      filters
    }));
  }

  atualizarPesquisa(pesquisa: string) {
    this.update(state => ({
      ...state,
      pesquisa
    }));
  }

  atualizarOrdenacao(coluna: string, direcao: string) {
    const sort = { coluna, direcao };
    this.update(state => ({
      ...state,
      sort
    }));
  }
}
