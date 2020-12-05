import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, timer} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BreweriesQuery} from '../breweries.query';
import {Breweries} from '../breweries.model';
import {BreweriesService} from '../breweries.service';
import {Toaster, ToastService} from '@cnj/uikit';
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-breweries-detail',
  templateUrl: './breweries-detail.component.html',
  styleUrls: ['./breweries-detail.component.scss'],
})
export class BreweriesDetailComponent implements OnInit, OnDestroy {

  item$: Observable<Breweries>;
  item: Breweries;

  protected isLoading$ = this.breweriesQuery.selectLoading();
  protected errorToaster: Toaster<any>;
  protected subscription = new Subscription();

  constructor(
      protected activatedRoute: ActivatedRoute,
      protected breweriesQuery: BreweriesQuery,
      protected breweriesService: BreweriesService,
      protected router: Router,
      protected toasterService: ToastService,
      protected confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit() {
    this.configurarMensagemDeErro();
    this.configurarMensagemDeCarregamento();

    this.subscription.add(this.activatedRoute.paramMap.subscribe((paramMap) => {

      const breweriesId = paramMap.get('breweriesId');
      if (breweriesId) {

        this.item$ = this.breweriesQuery.selectEntity(breweriesId);

        timer().subscribe(() => {
          this.subscription.add(this.breweriesService.buscarPorId(breweriesId).subscribe(
              (item: Breweries) => this.item = item,
              (error) => {
                timer().subscribe(() => {
                  this.toasterService.error(`Não foi possível retornar o item solicitado. Tente novamente mais tarde!`, error);
                });
              }
          ));
        });
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  excluir() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir este item?`,
      accept: () => {
        this.subscription.add(this.breweriesService.excluir(...[this.item.id]).subscribe(
            () => this.voltar(),
            (error) => {
              timer().subscribe(() => {
                this.toasterService.error('Não foi possível excluir estes itens. Por favor, tente novamente mais tarde!', error);
              });
            }));
      }
    });
  }

  alterar() {
    this.router.navigate([`alterar`], {relativeTo: this.activatedRoute});
  }

  voltar() {
    if (document.referrer.indexOf(location.host) !== -1) {
      history.go(-1);
    } else {
      this.router.navigate([`../`], {relativeTo: this.activatedRoute});
    }
  }

  configurarMensagemDeErro() {
    this.subscription.add(this.breweriesQuery.selectError().subscribe(error => {
      timer().subscribe(() => {
        if (error) {
          this.errorToaster = this.toasterService.error('Não foi possível buscar as informações solicitadas!', error);
        } else {
          if (this.errorToaster) {
            this.errorToaster.toastRef.close();
          }
        }
      });
    }));
  }

  configurarMensagemDeCarregamento() {
    this.toasterService.loading(this.isLoading$);
  }
}
