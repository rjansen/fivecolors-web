import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { Inventory } from './inventory/index';
import { Deck } from './deck/index';


export const ROUTES: Routes = [
  { path: '',      component: Deck },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: "inventory", component: Inventory },
  { path: "deck", component: Deck },
  { path: '**',    component: Deck },
];
