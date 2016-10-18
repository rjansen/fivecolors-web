/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AppState } from './app.service';
import { SessionService } from './services/index';

/*
 * Fivecolors Component
 * Top Level Component
 */
@Component({
  selector: 'fivecolors',
  // encapsulation: ViewEncapsulation.None,
  templateUrl: 'fivecolors.html',
  styleUrls: [
    './fivecolors.css'
  ]
})
export class Fivecolors implements OnInit {
  name = 'Fivecolors Web Interface';
  url = 'http://localhost:7080/web';
  public session = {
    username: "dummy_user"
  };

  constructor(
    private sessionService: SessionService,
    public appState: AppState
  ) { }

  ngOnInit() {
    this.sessionService.loadSession(s => {
      this.applyLoadSessionResult(s);
    });
    console.log('FivecolorsInit', this.appState.state);
  }

  applyLoadSessionResult(result) {
    this.session = result;
    console.log(`SessionLoaded session=${JSON.stringify(this.session)}`);
  }
}
