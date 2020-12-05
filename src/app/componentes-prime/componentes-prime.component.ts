import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ToastService } from '@cnj/uikit';


@Component({
  selector: 'app-componentes-prime',
  templateUrl: './componentes-prime.component.html',
  styleUrls: ['./componentes-prime.component.css']
})



export class ComponentesPrimeComponent implements OnInit {

  // Atributos
  protected isLoading$: Observable<boolean>;

  // Constutor
  constructor( protected toasterService: ToastService) {}

  ngOnInit() {
    this.isLoading$ = new Observable(subscriber => {
      subscriber.next(true);
      setTimeout(() => {
        subscriber.next(false);
      }, 2000);
    });

  }

  // Método
  onAction(){
    this.toasterService.loading(this.isLoading$);
  // this.toastService.success('mensagem do toast.', 'título do toast');
  // this.toastService.success('mensagem do toast.', 'título do toast');
  // this.toastService.warning('mensagem do toast.', 'título do toast');
  // this.toastService.info('mensagem do toast.', 'título do toast');

  }


}
