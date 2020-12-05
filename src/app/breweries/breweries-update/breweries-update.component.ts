import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, timer} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {BreweriesQuery} from '../breweries.query';
import {BreweriesService} from '../breweries.service';
import {Breweries, createBreweries} from '../breweries.model';
import {SaveButtonSelection, Toaster, ToastService} from '@cnj/uikit';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AkitaNgFormsManager} from '@datorama/akita-ng-forms-manager';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';

@Component({
  selector: 'app-breweries-update',
  templateUrl: './breweries-update.component.html',
  styleUrls: ['./breweries-update.component.scss'],
})
export class BreweriesUpdateComponent implements OnInit, OnDestroy, AfterViewInit {

  item: Breweries = null;
  isLoading$ = this.breweriesQuery.selectLoading();
  errorToaster: Toaster<any>;
  subscription: Subscription = new Subscription();
  breweriesForm: FormGroup;

  constructor(
      protected activatedRoute: ActivatedRoute,
      protected router: Router,
      protected breweriesQuery: BreweriesQuery,
      protected breweriesService: BreweriesService,
      protected formBuilder: FormBuilder,
      protected formManager: AkitaNgFormsManager<{ breweriesForm: { breweries: Breweries } }>,
      protected hotkeysService: HotkeysService,
      protected toasterService: ToastService,
  ) {
  }

  ngOnInit() {
    this.configurarMensagemDeErro();
    this.configurarMensagemDeCarregamento();

    this.subscription.add(
        this.activatedRoute.paramMap
            .subscribe(paramMap => {
              const breweriesId = paramMap.get('breweriesId');

              this.breweriesForm = this.formBuilder.group({
              breweries: new FormControl(''),
              });

              timer().subscribe(() => {
                if (breweriesId) {
                  this.subscription.add(this.breweriesService.buscarPorId(breweriesId).subscribe(
                      (item: Breweries) => {
                        if (!item) {
                          this.router.navigateByUrl('/not-found');
                        } else {
                          this.item = item;
                          this.inicializarFormulario();
                        }
                      },
                      (error) => {
                        timer().subscribe(() => {
                          this.toasterService.error('Não foi possível obter o registro. Tente novamente mais tarde!', error);
                        });
                      }));
                } else {
                  this.item = createBreweries();
                }
                this.inicializarFormulario();
              });
            })
    );
  }

  ngAfterViewInit() {
    this.hotkeysService.add(new Hotkey('ctrl+s', (event: KeyboardEvent): boolean => {
      this.salvar();
      return false;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.toasterService.clear();
  }

  inicializarFormulario() {
    if (this.item) {
      this.breweriesForm.reset({ breweries: this.item });
    } else {
      this.formManager.upsert('breweriesForm', this.breweriesForm);
    }
  }

  salvar(saveSelection = SaveButtonSelection.Salvar) {
    if (this.breweriesForm.valid) {

      const formValues = this.breweriesForm.value as { breweries: Breweries };
      const breweries = formValues.breweries;

      if (!breweries.id) {
        this.criar(breweries, saveSelection);
      } else {
        this.atualizar(breweries, saveSelection);
      }
    }
  }

  criar(breweries, saveSelection) {
    this.breweriesService.criar(breweries).subscribe((item) => {
          this.onDepoisSalvar(item, saveSelection);
          timer().subscribe(() => {
            this.toasterService.success("Cadastro realizado com sucesso!");
          });
        },
        (error) => {
          this.toasterService.error('Ocorreu um erro ao tentar executar a operação. Tente novamente mais tarde!', error);
        });
  }

  atualizar(breweries, saveSelection) {
    this.breweriesService.atualizar(breweries.id, breweries).subscribe((item) => {
          this.onDepoisSalvar(item, saveSelection);
          timer().subscribe(() => {
            this.toasterService.success("Alteração realizada com sucesso!");
          });
        },
        (error) => {
          this.toasterService.error('Ocorreu um erro ao tentar executar a operação. Tente novamente mais tarde!', error);
        });
  }

  onDepoisSalvar(breweries, saveSelection) {
    switch (saveSelection) {
      case SaveButtonSelection.SalvarVoltar:
        this.voltar();
        break;
      case SaveButtonSelection.SalvarNovo:
        this.breweriesForm.reset();
        break;
      default:
        if (breweries) {
          this.breweriesForm.reset({breweries});
        }
    }
  }

  voltar() {
    if (document.referrer.indexOf(location.host) !== -1) {
      history.go(-1);
    } else {
      this.router.navigate([`../`], {relativeTo: this.activatedRoute});
    }
  }

  configurarMensagemDeErro() {
    this.subscription.add(this.breweriesQuery.selectError()
        .subscribe(error => {
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
