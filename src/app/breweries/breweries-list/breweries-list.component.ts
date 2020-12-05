import {AfterViewInit, Component, Inject, inject, InjectionToken, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Breweries} from '../breweries.model';
import {BreweriesQuery} from '../breweries.query';
import {BreweriesService} from '../breweries.service';
import {BehaviorSubject, combineLatest, Observable, Subscription, timer} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AkitaNgFormsManager} from '@datorama/akita-ng-forms-manager';
import {FilterComponent, FilterService, FiltroOperador, Serializer, SERIALIZER_TOKEN, ToastService} from '@cnj/uikit';
import {PaginationResponse, PaginatorPlugin} from '@datorama/akita';
import {Hotkey, HotkeysService} from "angular2-hotkeys";
import {switchMap, tap} from "rxjs/operators";
import {ConfirmationService} from "primeng/api";
import {Paginator} from "primeng/paginator";

export const BREWERIES_PAGINATOR = new InjectionToken('BREWERIES_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const query = inject(BreweriesQuery);
    return new PaginatorPlugin(query).withControls().withRange();
  }
});

@Component({
  selector: 'app-breweries-list',
  templateUrl: './breweries-list.component.html',
  styleUrls: ['./breweries-list.component.scss'],
})
export class BreweriesListComponent implements OnInit, AfterViewInit, OnDestroy {
  colunasTabela = [
    {field: 'id', header: 'id'},
    {field: 'name', header: 'name'},
      {field: 'breweryType', header: 'breweryType'},
      {field: 'street', header: 'street'},
      {field: 'address2', header: 'address2'},
      {field: 'address3', header: 'address3'},
      {field: 'city', header: 'city'},
      {field: 'state', header: 'state'},
      {field: 'countyProvince', header: 'countyProvince'},
      {field: 'postalCode', header: 'postalCode'},
      {field: 'country', header: 'country'},
      {field: 'longitude', header: 'longitude'},
      {field: 'latitude', header: 'latitude'},
      {field: 'phone', header: 'phone'},
      {field: 'websiteUrl', header: 'websiteUrl'},
      {field: 'updatedAt', header: 'updatedAt'},
      {field: 'createdAt', header: 'createdAt'},
      
];

  data = [];
  total = this.paginatorPlugin.metadata.get('total');
  totalPorPagina = this.paginatorPlugin.metadata.get('totalPorPagina');

  isLoading$ = this.breweriesQuery.selectLoading();
  subscription: Subscription = new Subscription();
  itensPaginado$: Observable<PaginationResponse<Breweries>>;
  mudancaDeFiltro$ = this.breweriesQuery.obterFiltrosAsObservable();
  mudancaDePesquisa$ = new BehaviorSubject<any>(null);
  mudancaDeOrdenacao$ = new BehaviorSubject<any>({campo: 'id', direcao: 'asc'});
  mudancaDeTotalPorPagina$ = new BehaviorSubject<any>(5);
  mudancaDeItensSelecionados$ = this.breweriesQuery.selectActive();

  filtroForm: FormGroup;

  @ViewChild('paginator') paginador: Paginator;
  @ViewChild(FilterComponent) filterComponent: FilterComponent;

  constructor(
      protected router: Router,
      protected formBuilder: FormBuilder,
      protected toasterService: ToastService,
      protected filterService: FilterService,
      protected hotkeysService: HotkeysService,
      protected activatedRoute: ActivatedRoute,
      protected breweriesQuery: BreweriesQuery,
      protected breweriesService: BreweriesService,
      protected confirmationService: ConfirmationService,
      protected formManager: AkitaNgFormsManager<{ 'breweriesFiltersForm' }>,
      @Inject(SERIALIZER_TOKEN) protected serializer: Serializer,
      @Inject(BREWERIES_PAGINATOR) protected paginatorPlugin: PaginatorPlugin<Breweries>
) {
  }

  ngOnInit() {
    this.filtroForm = this.formBuilder.group({
          id: new FormControl('', Validators.pattern('^[0-9]*$')),
        
          name: new FormControl(''),
          breweryType: new FormControl(''),
          street: new FormControl(''),
          address2: new FormControl(''),
          address3: new FormControl(''),
          city: new FormControl(''),
          state: new FormControl(''),
          countyProvince: new FormControl(''),
          postalCode: new FormControl(''),
          country: new FormControl(''),
          longitude: new FormControl(''),
          latitude: new FormControl(''),
          phone: new FormControl(''),
          websiteUrl: new FormControl(''),
          updatedAt: new FormControl(''),
          createdAt: new FormControl(''),
  });

    this.subscription.add(this.mudancaDeFiltro$.subscribe(filtros => this.filterService.setCountFilter(filtros.length)));
    this.formManager.upsert('breweriesFiltersForm', this.filtroForm);
    this.configurarPaginacao();
    this.configurarMensagemDeCarregamento();
    this.configurarMensagemDeErro();
  }

  ngAfterViewInit() {
    this.hotkeysService.add(new Hotkey('ctrl+alt+n', (event: KeyboardEvent): boolean => {
      this.router.navigate([`cadastrar`], {relativeTo: this.activatedRoute});
      return false;
    }));

    this.hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {
      const page = this.paginador.getPage();
      this.paginador.changePage(page + 1);
      return false;
    }));
    this.hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      const page = this.paginador.getPage();
      this.paginador.changePage(page - 1);
      return false;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.paginatorPlugin.destroy();
    this.toasterService.clear();
  }

  configurarPaginacao() {
    this.itensPaginado$ = combineLatest([this.paginatorPlugin.pageChanges,
      combineLatest([this.mudancaDeOrdenacao$, this.mudancaDeTotalPorPagina$, this.mudancaDeFiltro$, this.mudancaDePesquisa$])
          .pipe(tap(_ => this.setarValorInicial()))])
        .pipe(switchMap(([pagina, [ordenacao, totalPorPagina, filtros, pesquisa]]) => {
              const request = () => this.breweriesService.buscar(pagina, ordenacao, totalPorPagina, filtros, pesquisa);
              return this.paginatorPlugin.getPage(request as any) as Observable<PaginationResponse<Breweries>>;
            })
        );

    this.subscription.add(this.itensPaginado$.subscribe((itens) => {
      this.paginatorPlugin.metadata.set('total', itens.total);
      this.totalPorPagina = this.paginatorPlugin.metadata.get('totalPorPagina');
      this.total = this.paginatorPlugin.metadata.get('total');
      this.data = itens.data;
    }));
  }

  setarValorInicial() {
    this.paginatorPlugin.clearCache();
    this.paginatorPlugin.metadata.set('totalPorPagina', 5);
  }

  paginar({rows, page}) {
    if (this.totalPorPagina !== rows) {
      this.alterarTotalRegistroPorPagina(rows);
    } else {
      this.alterPagina(page + 1);
    }

    this.breweriesService.salvarItensSelecionados([]);
  }

  alterarTotalRegistroPorPagina(totalPorPagina) {
    this.paginatorPlugin.metadata.set('totalPorPagina', totalPorPagina);
    this.mudancaDeTotalPorPagina$.next(totalPorPagina);
  }

  alterPagina(pagina) {
    this.paginatorPlugin.metadata.set('pagina', pagina);
    this.paginatorPlugin.setPage(pagina);
  }

  ordernar({field, order}) {
    const ordenacao = {campo: field, direcao: order === 1 ? 'asc' : 'desc'};
    const mudanca = this.mudancaDeOrdenacao$.value;

    if (mudanca.campo !== ordenacao.campo || mudanca.direcao !== ordenacao.direcao) {
      this.paginatorPlugin.metadata.set('ordenacao', ordenacao);
      this.mudancaDeOrdenacao$.next(ordenacao);
    }
  }

  pesquisar(termo) {
    /* TODO: Verificar se o serializador utilizado (informado com o provider: SERIALIZER_TOKEN no module)
        suporta  SearchMode.FullTextSearch, do contrario deve ser informado o campo a ser utilizado na pesquisa
    */
    this.mudancaDePesquisa$.next({termo, config: {filtro: {campos: ['name']}}});
  }

  editarItem(row: Breweries) {
    this.router.navigate([`${row.id}/alterar`], {relativeTo: this.activatedRoute});
  }

  visualizarItem(row: Breweries) {
    this.router.navigate([`${row.id}`], {relativeTo: this.activatedRoute});
  }

  excluirItemsSelecionados() {
    const itemsIds = this.breweriesQuery.obterIdsSelecionados();

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir os itens selecionados?`,
      accept: () => {
        this.excluirItems(itemsIds);
      }
    });
  }

  excluirItem(row: Breweries) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir?`,
      accept: () => {
        this.excluirItems([row.id]);
      }
    });
  }

  excluirItems(itemsIds) {
    this.subscription.add(this.breweriesService.excluir(...itemsIds).subscribe(
        () => {
          this.breweriesService.salvarItensSelecionados([]);
          this.paginatorPlugin.refreshCurrentPage();
        },
        (error) => {
          timer().subscribe(() => {
            this.toasterService.error('Não foi possível excluir estes itens. Por favor, tente novamente mais tarde!', error);
          });
        }));
  }

  selecionarItem(itensSelecionados) {
    this.breweriesService.salvarItensSelecionados(itensSelecionados.map(breweries => breweries.id));
  }

  itemToggle(event, breweries) {
    const checkbox = event.target.classList.contains('ui-chkbox-box');

    if (!checkbox && event.pointerType === 'touch') {
      this.visualizarItem(breweries);
    } else {
      this.selecionarLinha(breweries);
    }
  }

  selecionarLinha(breweries) {
    let itemsIds = [...this.breweriesQuery.obterIdsSelecionados()];
    const index = itemsIds.indexOf(breweries.id);

    if (index >= 0) {
      itemsIds.splice(index, 1);
    } else {
      itemsIds = [...itemsIds, breweries.id];
    }

    this.breweriesService.salvarItensSelecionados(itemsIds);
  }

  filtrar() {
    if (this.filtroForm.valid) {
      const novosFiltros = this.filtroForm.value;
      const filtros = JSON.parse(JSON.stringify(this.breweriesQuery.obterFiltros()));

      if (novosFiltros) {
        if (novosFiltros.id) {
          const coluna = 'id';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.id;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.name) {
          const coluna = 'name';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.name;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.breweryType) {
          const coluna = 'breweryType';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.breweryType;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.street) {
          const coluna = 'street';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.street;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.address2) {
          const coluna = 'address2';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.address2;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.address3) {
          const coluna = 'address3';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.address3;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.city) {
          const coluna = 'city';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.city;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.state) {
          const coluna = 'state';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.state;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.countyProvince) {
          const coluna = 'countyProvince';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.countyProvince;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.postalCode) {
          const coluna = 'postalCode';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.postalCode;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.country) {
          const coluna = 'country';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.country;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.longitude) {
          const coluna = 'longitude';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.longitude;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.latitude) {
          const coluna = 'latitude';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.latitude;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.phone) {
          const coluna = 'phone';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.phone;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.websiteUrl) {
          const coluna = 'websiteUrl';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.websiteUrl;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.updatedAt) {
          const coluna = 'updatedAt';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.updatedAt;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
        if (novosFiltros.createdAt) {
          const coluna = 'createdAt';
          // TODO: Verificar se o tipo do valor está correto.
          const valor = novosFiltros.createdAt;
          filtros.push({campo: coluna, operador: FiltroOperador.Igual, valor});
        }
        
      }

      this.filtroForm.reset();
      this.paginatorPlugin.metadata.set('filtros', filtros);
      this.breweriesService.aplicarFiltros(filtros);
      this.filterComponent.close();
    }
  }

  removerFiltro(filter) {
    const filtrosAplicados = JSON.parse(JSON.stringify(this.breweriesQuery.obterFiltros()));
    const index = filtrosAplicados.indexOf(filter);
    filtrosAplicados.splice(index, 1);
    this.breweriesService.aplicarFiltros(filtrosAplicados);
  }

  limparFiltro() {
    this.breweriesService.aplicarFiltros([]);
  }

  configurarMensagemDeCarregamento() {
    this.toasterService.loading(this.isLoading$);
  }

  configurarMensagemDeErro() {
    this.subscription.add(this.breweriesQuery.selectError().subscribe(error => {
      if (error) {
        timer().subscribe(() => {
          this.toasterService.error('Não foi possível buscar as informações solicitadas!', error);
        });
      }
    }));
  }
}
