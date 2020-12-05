import {Inject, Injectable} from '@angular/core';
import {cacheable, ID, PaginationResponse} from '@datorama/akita';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {BreweriesStore} from './breweries.store';
import {Breweries} from './breweries.model';
import {forkJoin, Observable, throwError} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';
import {
    FiltroComposto,
    FiltroCompostoOperador,
    ParametrosDaRequisicao,
    prepare,
    Serializer,
    SERIALIZER_TOKEN
} from '@cnj/uikit';

@Injectable({providedIn: 'root'})
export class BreweriesService {

    constructor(
        protected breweriesStore: BreweriesStore,
        @Inject(SERIALIZER_TOKEN) protected serializer: Serializer,
        protected http: HttpClient
    ) {
    }

    // TODO: configurar o endereço da api environment e substituir por environment.settings.api.url;
    protected url = 'https://api.openbrewerydb.org/breweries';

    private mapearResultado(response, pagina, itensPorPagina): PaginationResponse<Breweries> {
        // TODO: Mapear response para o PaginationResponse<Breweries>
        return {
            data: response.result,
            total: response['page-info'].count,
            perPage: response['page-info'].size,
            currentPage: pagina,
        } as PaginationResponse<Breweries>;
    }

    private obterParametrosSerializado(pagina, sortBy, itensPorPagina, filtros, pesquisa): HttpParams {
        const filtrosComposto = {operador: FiltroCompostoOperador.E, filtros} as FiltroComposto;
        const paginacao = {pagina, itensPorPagina};
        const paramns = {pesquisa, filtros: filtrosComposto, ordenacoes: [sortBy], paginacao} as ParametrosDaRequisicao;
        const parametrosSerializados = this.serializer.serialize(paramns);
        return new HttpParams({fromString: parametrosSerializados});
    }

    private executarBusca(request) {
        return cacheable(this.breweriesStore, request)
            .pipe(catchError((error: HttpErrorResponse) => {
                    this.breweriesStore.setError(error);
                    return throwError(error);
                }),
                prepare(() => {
                    this.breweriesStore.setError(null);
                    this.breweriesStore.setLoading(true);
                }),
                finalize(() => this.breweriesStore.setLoading(false)));
    }

    buscar(pagina, ordernacao, itensPorPagina, filtros, pesquisa) {
        const request$ = this.http.get<any>(this.url, {
            params: this.obterParametrosSerializado(pagina, ordernacao, itensPorPagina, filtros, pesquisa)
        }).pipe(map((response) => this.mapearResultado(response, pagina, itensPorPagina)));

        return this.executarBusca(request$);
    }

    buscarPorId(id: ID) {
        const request$ = this.http.get<Breweries>(`${this.url}/${id}`)
            .pipe(map(item => (item as any).result ? (item as any).result : (item as any)))
            .pipe(catchError((error: HttpErrorResponse) => {
                    this.breweriesStore.setError(error);
                    return throwError(error);
                }),
                tap((item) => this.breweriesStore.add(item)),
            );

        return this.executarBusca(request$);
    }

    criar(breweries: Breweries) {
        return this.http.post<any>(`${this.url}`, breweries)
            .pipe(map(item => (item as any).result ? (item as any).result : (item as any)))
            .pipe(tap((breweriesAdded) => {
                    this.breweriesStore.add(breweriesAdded);
                }),
                catchError((error: HttpErrorResponse) => {
                    this.breweriesStore.setError(error);
                    return throwError(error);
                }),
                prepare(() => {
                    this.breweriesStore.setError(null);
                    this.breweriesStore.setLoading(true);
                }),
                finalize(() => this.breweriesStore.setLoading(false))
            );
    }

    atualizar(id, breweries: Partial<Breweries>) {
        return this.http.put(`${this.url}/${id}`, breweries)
            .pipe(map(item => (item as any).result ? (item as any).result : (item as any)))
            .pipe(tap(() => this.breweriesStore.update(id, breweries)),
                catchError((error: HttpErrorResponse) => {
                    this.breweriesStore.setError(error);
                    return throwError(error);
                }),
                prepare(() => {
                    this.breweriesStore.setError(null);
                    this.breweriesStore.setLoading(true);
                }),
                finalize(() => this.breweriesStore.setLoading(false))
            ) as Observable<Breweries>;
    }

    excluir(...ids: ID[]) {
        const observables: Observable<any>[] = [];

        ids.forEach(id => {
            const deleteObservable = this.http.delete(`${this.url}/${id}`)
                .pipe(map(() => id));
            observables.push(deleteObservable);
        });

        return forkJoin(observables)
            .pipe(tap(id => this.breweriesStore.remove(id)),
                catchError((error: HttpErrorResponse) => {
                    this.breweriesStore.setError(error);
                    return throwError(error);
                }),
                prepare(() => {
                    this.breweriesStore.setError(null);
                    this.breweriesStore.setLoading(true);
                }),
                finalize(() => this.breweriesStore.setLoading(false))
            );
    }

    salvarItensSelecionados(ids: ID[]) {
        return this.breweriesStore.setActive(ids);
    }

    aplicarFiltros(filtrosJaAplicados) {
        this.breweriesStore.atualizarFiltros(filtrosJaAplicados);
    }
}
