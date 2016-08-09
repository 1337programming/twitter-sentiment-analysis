import { provideRouter, RouterConfig } from '@angular/router';
import { Tweets } from './components/tweets/tweets.component';

export const routes: RouterConfig = [
  {path: '', component: Tweets}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
