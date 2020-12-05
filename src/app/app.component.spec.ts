import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {AppComponent, LOCATION_TOKEN} from './app.component';
import {
  AuthModule, AuthorizationConfig,
  AuthorizationConfigToken,
  IAuthorizationManagerToken, LOG_CONSUMER_SERVICE, LogConsoleConsumerService, LogModule,
  NoRouteReuseStrategy, NotFoundModule,
  OIDC_CONFIG, OidcAuthModule, OpenIDConnectSettings, SEARCH_TOKEN, SearchKeepService,
  UikitModule,
  UmaAuthorizationManager, UnauthorizedModule, UpdateModule
} from '@cnj/uikit';
import {MatFormFieldModule, MatListModule, MatSelectModule} from '@angular/material';
import {RouteReuseStrategy} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BUILD_ENVIRONMENT} from '../build/build-environment';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {AppRoutingModule} from './app-routing.module';
import { environment } from './environment';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app-config.model';

function initializeApp(environmentConfig: environment) {
  return (): Promise<AppConfig> => environmentConfig.load();
}

const configServiceFactory = (): OpenIDConnectSettings => {
  return {
    client_uri: 'http://localhost:8080/auth/realms/master/',
    authority: 'http://localhost:8080/auth/realms/master/',
    client_id: 'localhost',
    scope: 'openid profile email roles offline_access'
  };
};

const authorizationConfigFactory = (): AuthorizationConfig => {
  return {
    clientId: 'localhost',
    umaConfig: {
      permissionEndpoint: `http://localhost:8080/auth/realms/master/authz/protection/permission`,
      tokenEndpoint: `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`,
    }
  };
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async(() => {
    locationSpy = jasmine.createSpyObj<Location>([ 'assign' ], {
      hostname: 'cnj.jus.br',
      protocol: 'http:',
      href: 'http://cnj.jus.br'
    });

    TestBed.configureTestingModule({
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
            ServiceWorkerModule.register('ngsw-worker.js', {enabled: BUILD_ENVIRONMENT.production}),
            BUILD_ENVIRONMENT.production ? [] : [AkitaNgDevtools.forRoot()],
            AppRoutingModule,
            UpdateModule
          ],
          declarations: [
            AppComponent,
          ],
          providers: [
            environment,
            {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [environment], multi: true},
            {provide: RouteReuseStrategy, useClass: NoRouteReuseStrategy},
            {provide: OIDC_CONFIG, useFactory: configServiceFactory},
            {provide: AuthorizationConfigToken, useFactory: authorizationConfigFactory},
            {provide: IAuthorizationManagerToken, useClass: UmaAuthorizationManager},
            {provide: LOG_CONSUMER_SERVICE, useClass: LogConsoleConsumerService, multi: true},
            {provide: SEARCH_TOKEN, useClass: SearchKeepService, multi: true},
            {provide: LOCATION_TOKEN, useValue: {
                hostname: locationSpy.hostname,
                protocol: locationSpy.protocol,
                href: locationSpy.href,
                assign: locationSpy.assign
              }
            }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    environment.settings = {
      name: 'local',
      production: false,
      api: {
        url: 'https://172.20.53.188:5001/api'
      },
      authentication: {
        client_uri: '',
        authority: 'http://localhost:8080/auth/realms/master/',
        client_id: 'localhost',
        scope: 'openid profile email roles offline_access'
      }
    };

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('#showSearch should return real value', () => {
    const compiled = fixture.debugElement.componentInstance;
    expect(compiled.showSearch).toBe(undefined);
  });

  it('should redirects https when supports', async(() => {
    component.estaAplicacaoSuportaHttpsEmProducao = true;
    component.ngOnInit();
    const spy = locationSpy.assign as jasmine.Spy;
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.first().args[0]).toContain('https://cnj.jus.br');
  }));
});
