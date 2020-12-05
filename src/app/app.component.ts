import {Component, OnInit, InjectionToken, Inject} from '@angular/core';
import { environment } from './environment';

export const LOCATION_TOKEN = new InjectionToken<Location>('Window location object');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public name = environment.settings.name;
  public production = environment.settings.production;
  public estaAplicacaoSuportaHttpsEmProducao = false;

  constructor(@Inject(LOCATION_TOKEN) private location: Location) {}

  ngOnInit() {
    // Se sua aplicação é publicada em servidor que suporta HTTPS e deseja que utilize recursos PWA (adicionar à tela inicial/instalação)
    // ative esta variável. Mais detalhes em: https://developers.google.com/web/progressive-web-apps
    // if is not localhost
    if (!(this.location.hostname === 'localhost' || this.location.hostname === '127.0.0.1' || this.location.hostname === '')) {
      // if is not in https
      if (this.location.protocol !== 'https:' && this.estaAplicacaoSuportaHttpsEmProducao) {
        // redirect to https (pwa requirement)
        this.location.assign('https:' + this.location.href.substring(this.location.protocol.length));
      }
    }
  }

}
