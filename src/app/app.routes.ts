import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { About } from './about';
import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'about', component: About },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
  },
  { path: '**',    component: NoContent },
  /*
  {path: "/invetory", name: "InventoryManager", component: InventoryManagerComponent, useAsDefault: true},
  {path: "/deck", name: "DeckManager", component: DeckManagerComponent},
  {path: "/game", name: "GameManager", component: GameManagerComponent}
  */
];
