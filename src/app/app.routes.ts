import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
// import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';
import { Inventory } from './inventory/index';
import { Deck } from './deck/index';


export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: "inventory", component: Inventory },
  { path: "deck", component: Deck },
  { path: '**',    component: Inventory },
];
