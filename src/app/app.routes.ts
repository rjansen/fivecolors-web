import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import { Inventory } from './inventory/index';
import { Deck } from './deck/index';
import { NewDeck } from './newdeck/index';


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: "inventory", component: Inventory },
  { path: "deck", component: Deck },
  { path: "newdeck", component: NewDeck },
  { path: '**',    component: Inventory },
  { path: '**',    component: NoContentComponent },
];
