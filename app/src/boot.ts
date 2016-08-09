import {bootstrap} from '@angular/platform-browser-dynamic';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {APP_ROUTER_PROVIDERS} from './common/app.routes';
import {AppComponent} from './components/app.component';

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: HashLocationStrategy},
]);

