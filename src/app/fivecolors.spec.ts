import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { Fivecolors } from './fivecolors.component';
import { AppState } from './app.service';

describe('Fivecolors', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppState,
      Fivecolors
    ]}));

  it('should have a url', inject([ Fivecolors ], (fivecolors: Fivecolors) => {
    expect(fivecolors.url).toEqual('https://moon.e-pedion.com/fivecolors/web');
  }));

});
