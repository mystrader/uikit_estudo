import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatSelectModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {
  AuthModule, AuthorizationConfig, AuthorizationConfigToken, IAuthorizationManagerToken, LOG_CONSUMER_SERVICE, LogConsoleConsumerService,
  LogModule,
  NoRouteReuseStrategy,
  NotFoundModule, OIDC_CONFIG,
  OidcAuthModule, OpenIDConnectSettings, SEARCH_TOKEN, SearchKeepService,
  UikitModule, UmaAuthorizationManager,
  UnauthorizedModule,
  UpdateModule
} from '@cnj/uikit';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BUILD_ENVIRONMENT} from '../../build/build-environment';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';
import {AppRoutingModule} from '../app-routing.module';
import {environment} from '../environment';
import {RouteReuseStrategy} from '@angular/router';

export const configServiceFactory = (): OpenIDConnectSettings => {
  return {
    client_uri: 'http://localhost:8080/auth/realms/master/',
    authority: 'http://localhost:8080/auth/realms/master/',
    client_id: 'localhost',
    scope: 'openid profile email roles offline_access'
  };
};

export const authorizationConfigFactory = (): AuthorizationConfig => {
  return {
    clientId: 'localhost',
    umaConfig: {
      permissionEndpoint: `http://localhost:8080/auth/realms/master/authz/protection/permission`,
      tokenEndpoint: `http://localhost:8080/auth/realms/master/protocol/openid-connect/token`,
    }
  };
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DashboardRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
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
        DashboardComponent,
      ],
      providers: [
        environment,
        {provide: RouteReuseStrategy, useClass: NoRouteReuseStrategy},
        {provide: OIDC_CONFIG, useFactory: configServiceFactory},
        {provide: AuthorizationConfigToken, useFactory: authorizationConfigFactory},
        {provide: IAuthorizationManagerToken, useClass: UmaAuthorizationManager},
        {provide: LOG_CONSUMER_SERVICE, useClass: LogConsoleConsumerService, multi: true},
        {provide: SEARCH_TOKEN, useClass: SearchKeepService, multi: true},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
