import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import {
  UikitModule,
  NotFoundModule,
  AuthModule,
  OidcAuthModule,
  OIDC_CONFIG,
  UnauthorizedModule,
  LOG_CONSUMER_SERVICE,
  LogConsoleConsumerService,
  LogModule,
  UpdateModule,
  NoRouteReuseStrategy,
  UmaAuthorizationManager,
  IAuthorizationManagerToken,
  AuthorizationConfigToken,
  AuthorizationConfig,
  OpenIDConnectSettings,
  SEARCH_TOKEN,
  SearchKeepService,
  PjeSerializerService,
  SERIALIZER_TOKEN,
  KeycloakAuthenticationManager,
  IAuthenticationManagerToken,
  UserAuthorizationManager
} from '@cnj/uikit';

import { AppComponent, LOCATION_TOKEN } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// Coisas que eles importaram
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './environment';
import { AppConfig } from './app-config.model';
import { BUILD_ENVIRONMENT } from 'src/build/build-environment';


// importando material
import {
  MatListModule,
  MatFormFieldModule,
  MatSelectModule
} from '@angular/material';



import { RouteReuseStrategy } from '@angular/router';


export function initializeApp(environmentConfig: environment) {
  return (): Promise<AppConfig> => environmentConfig.load();
}

const authenticationConfigFactory = (): OpenIDConnectSettings => {
  const authenticationSettings = environment.settings.authentication;
  return authenticationSettings;
};

const authorizationConfigFactory = (): AuthorizationConfig => {
  const authenticationSettings: AuthorizationConfig = {
    clientId: environment.settings.authentication.client_id,
    umaConfig: {
      permissionEndpoint: `${environment.settings.authentication.authority}authz/protection/permission`,
      tokenEndpoint: `${environment.settings.authentication.authority}protocol/openid-connect/token`
    }
  };
  return authenticationSettings;
};


// import { ComponentesPrimeComponent } from './componentes-prime/componentes-prime.component';



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    UikitModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    LogModule,
    NotFoundModule,
    UnauthorizedModule,
    AuthModule,
    OidcAuthModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: BUILD_ENVIRONMENT.production
    }),
    BUILD_ENVIRONMENT.production ? [] : [AkitaNgDevtools.forRoot()], // AkitaNgRouterStoreModule.forRoot()
    AppRoutingModule,
    UpdateModule,
  ],
  providers: [
    // Configuração baseado em variáveis de ambiente
    environment,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [environment], multi: true },

    // Força carregamento completo da página caso mude um parâmetro
    // (o padrão do angular quando um parâmetro é modificado é só disparar o observable)
    { provide: RouteReuseStrategy, useClass: NoRouteReuseStrategy },

    // Configuração de autenticação (OpenID Connect)
    { provide: OIDC_CONFIG, useFactory: authenticationConfigFactory },
    { provide: IAuthenticationManagerToken, useClass: KeycloakAuthenticationManager },

    // Configuração de autorização (Baseado em informações/claims do usuário autenticado)
    { provide: AuthorizationConfigToken, useFactory: authorizationConfigFactory },
    { provide: IAuthorizationManagerToken, useClass: UserAuthorizationManager },

    // Configuração de log (LogService)
    { provide: LOG_CONSUMER_SERVICE, useClass: LogConsoleConsumerService, multi: true },

    // Serviço de pesquisa para o Layout (Shell) que retorna os itens de menus
    { provide: LOCATION_TOKEN, useValue: window.location },

    // Serviço de serialização do ParametrosDaRequisicao
    { provide: SERIALIZER_TOKEN, useClass: PjeSerializerService }

    // Configuração do provedor de favoritos
    // (desabilitado por padrâo devido ser necessário implementação no backend)
    // { provide: FAVORITOS_SERVICE_TOKEN, useClass: AppFavoritosService },
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule { }
