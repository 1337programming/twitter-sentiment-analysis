import {provideRouter, RouterConfig} from '@angular/router';
import {TwitterHandler} from '../components/twitter-handler/twitter-handler.component';

export const routes: RouterConfig = [
  {path: '', redirectTo: '/home', terminal: true},
  {path: 'home', component: TwitterHandler}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
