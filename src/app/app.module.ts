import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EntityDataModule } from '@ngrx/data';
import { EffectsModule } from '@ngrx/effects';
import {
  NavigationActionTiming, RouterState, StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from '@reducers';
import { effects } from '@effects';
import { InterceptorService } from '@services';
import * as Hammer from 'hammerjs';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { appConfig } from './app.metadata';
import { AppRoutes } from './app.routing';
import { AppSerializer } from './app.serializer';
import { ExtrasModule } from './extras/extras.module';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
export class HammerConfig extends HammerGestureConfig {
  // tslint:disable-next-line: no-angle-bracket-type-assertion
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}
const config: SocketIoConfig = { url: environment.socketServer, options: {} };
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutes,
    HttpClientModule,
    BrowserAnimationsModule,
    ExtrasModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    SocketIoModule.forRoot(config),
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase.config),
    StoreModule.forRoot(reducers, {
      metaReducers
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !environment.production }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot({
      serializer: AppSerializer,
      routerState: RouterState.Minimal,
      navigationActionTiming: NavigationActionTiming.PostActivation,
      stateKey: 'router',
    }),
    EntityDataModule.forRoot(appConfig),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
