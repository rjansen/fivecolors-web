/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';

/*
 * Fivecolors Component
 * Top Level Component
 */
@Component({
    selector: 'fivecolors',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'fivecolors.html',
    styleUrls: [
      './fivecolors.css'
    ]
})
export class Fivecolors {
  name = 'Fivecolors Web Interface';
  url = 'http://localhost:7080/web';
  session = {
    username: "Dummy User"
  };

  constructor(
    public appState: AppState
  ) {}

  ngOnInit() {
    console.log('Fivecolors Init', this.appState.state);
  }

}
