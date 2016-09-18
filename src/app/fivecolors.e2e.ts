describe('Fivecolors', () => {

  beforeEach(() => {
    browser.get('/');
  });


  it('should have a title', () => {
    let subject = browser.getTitle();
    let result  = 'Fivecolors Web Interface';
    expect(subject).toEqual(result);
  });

  it('should have nav', () => {
    let subject = element(by.css('nav')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <Inventory>', () => {
    let subject = element(by.id('inventoryLink')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <Inventory>', () => {
    let subject = element(by.id('inventoryLink')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <Deck>', () => {
    let subject = element(by.id('deckLink')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

  it('should have <Game>', () => {
    let subject = element(by.id('gameLink')).isPresent();
    let result  = true;
    expect(subject).toEqual(result);
  });

});
