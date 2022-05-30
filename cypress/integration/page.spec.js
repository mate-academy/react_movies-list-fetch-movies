const page = {
  findMovie(input) {
    return cy.get('#movie-title')
      .type(`${input}`)
      .get('button').eq(0).click();
  }
};

const btn = {
  clickBtn() {
    return cy.get('button')
      .eq(1)
      .click();
  }
};

describe('Page', () => {
  beforeEach (() => {
    cy.visit ('/')
  });

  it('should send a request to www.omdbapi.com', () => {
    cy.intercept('*/www.omdbapi.com/*', cy.spy()
      .as('apiCall'));
    page.findMovie('car');
    cy.get('@apiCall')
      .its('callCount')
      .should('equal', 1);
  });

  it('should find movie', ()=> {
    page.findMovie('car');
    cy.getByDataCy('container')
      .should('contain', 'Preview');
    cy.getByDataCy('movie-title')
      .should('contain', `Dude, Where's My Car?`);
    cy.getByDataCy('content')
      .should('contain', 'Two potheads wake up after a night of partying');
    cy.getByDataCy('card-image')
      .should('exist');
  });

  it('should add movie to list', () =>{
    page.findMovie('car');
    btn.clickBtn();
    cy.get('.movies')
      .children()
      .should('have.length', 1);
  });

  it('should not add film twice', () => {
    page.findMovie('car');
    btn.clickBtn();
    cy.get('button')
      .eq(1)
      .should('be.disabled');
  });

  it('should clear the form after adding film to the list', () =>{
    page.findMovie('car');
    btn.clickBtn();
    cy.get('.sidebar')
      .children()
      .should('have.length', 1);
  });

  it('should display error message if film is not found', () => {
    page.findMovie('!@#');
    cy.get('.sidebar')
      .should('contain', "Can't find a movie with such a title");
  });

  it('should hide error message after changing film title', () => {
    page.findMovie('!@#');
    cy.get('.sidebar')
      .should('contain', "Can't find a movie with such a title");
    cy.get('#movie-title')
      .type('{selectall}car');
    cy.get('.sidebar')
      .should('not.contain', "Can't find a movie with such a title");
  });
});
