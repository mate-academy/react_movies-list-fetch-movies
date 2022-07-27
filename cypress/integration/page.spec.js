const page = {
  stubRequest: () => cy.intercept('*/www.omdbapi.com/*', cy.stub().as('apiCall')),
  mockRogueOne: () => cy.intercept('*/www.omdbapi.com/*', { fixture: 'rogueOne' }),
  mockStarTrek: () => cy.intercept('*/www.omdbapi.com/*', { fixture: 'starTrek' }),
  mockNoPoster: () => cy.intercept('*/www.omdbapi.com/*', { fixture: 'noPoster' }),
  mockNotFound: () => cy.intercept('*/www.omdbapi.com/*', { fixture: 'notFound' }),

  getByDataCy: name => cy.get(`[data-cy="${name}"]`),
  
  titleField: () => page.getByDataCy('titleField'),
  errorMessage: () => page.getByDataCy('errorMessage'),
  searchButton: () => page.getByDataCy('searchButton'),
  addButton: () => page.getByDataCy('addButton'),
  movieCards: () => page.getByDataCy('movieCard'),
  previewContainer: () => cy.get('[data-cy="previewContainer"]'),
  previewTitle: () => page.previewContainer().find('[data-cy="movieTitle"]'),
  previewPoster: () => page.previewContainer().find('[data-cy="moviePoster"]'),
  previewURL: () => page.previewContainer().find('[data-cy="movieURL"]'),
  previewDescription: () => page.previewContainer().find('[data-cy="movieDescription"]'),
};

describe('Page by default', () => {
  beforeEach (() => {
    page.stubRequest();
    cy.visit ('/');
  });

  it('should not have movies', () => {
    page.movieCards().should('have.length', 0);
  });

  it('should have the disabled search button', () => {
    page.searchButton().should('be.disabled');
  });

  it('should not have the add button', () => {
    page.addButton().should('not.exist');
  });

  it('should have and empty title field', () => {
    page.titleField().should('have.value', '');
  });

  it('should not show error', () => {
    page.errorMessage().should('not.exist')
  });
});

describe('API request', () => {
  beforeEach(() => {
    page.stubRequest();
    cy.visit('/');
  });

  it('should not be sent on page load', () => {
    cy.get('@apiCall')
      .its('callCount')
      .should('equal', 0);
  });

  it('should be sent on submit', () => {
    page.titleField().type('Rogue one')
    page.searchButton().click();

    cy.get('@apiCall')
      .its('callCount')
      .should('equal', 1);
  });

  it('should not be sent it a title is not entered', () => {
    page.searchButton().click({ force: true });

    cy.get('@apiCall')
      .its('callCount')
      .should('equal', 0);
  });
});

describe('Search form', () => {
  beforeEach (() => {
    page.stubRequest();
    cy.visit ('/');
  });

  it('should allow to enter a title', () => {
    page.titleField()
      .type('Hello, world!')
      .should('have.value', 'Hello, world!');
  });

  it('should enable the search button after entering a title', () => {
    page.titleField().type('Rogue');
    page.searchButton().should('not.be.disabled');
  });

  it('should disable search button after clearing the title', () => {
    page.titleField()
      .type('Rogue')
      .type('{selectAll}{backspace}');

    page.searchButton().should('be.disabled');
  });
});

describe('FindMovie component', () => {
  beforeEach (() => {
    cy.visit ('/');
  });

  it('should not show a spinner before the search request ', () => {
    page.searchButton()
      .should('not.have.class', 'is-loading');
  });
  
  it('should show a spinner while waiting for the search results', () => {
    cy.clock();
    cy.intercept('*/www.omdbapi.com/*', (req) => {
      req.reply({
        fixture: 'rogueOne',
        delay: 500,
      })
    });

    page.titleField().type('Rogue');
    page.searchButton().click();

    page.searchButton()
      .should('have.class', 'is-loading');
  });

  it('should hide a spinner after search response', () => {
    cy.clock();
    cy.intercept('*/www.omdbapi.com/*', (req) => {
      req.reply({
        fixture: 'rogueOne',
        delay: 500,
      })
    })
      .as('serachRequest');

    page.titleField().type('Rogue');
    page.searchButton().click();

    cy.tick(600);

    cy.wait('@serachRequest');

    page.searchButton()
      .should('not.have.class', 'is-loading');
  });

  it('should hide a spinner after an empty response', () => {
    page.mockNotFound().as('serachRequest');
    page.titleField().type('qwerqwerqwer');
    page.searchButton().click();

    cy.wait('@serachRequest');

    page.searchButton()
      .should('not.have.class', 'is-loading');
  });

  it('should hide a spinner after an error', () => {
    cy.intercept('*/www.omdbapi.com/*', (req) => {
      req.destroy();
    });

    page.titleField().type('qwerqwerqwer');
    page.searchButton().click();

    page.searchButton()
      .should('not.have.class', 'is-loading');
  });

  it('should show the preview if the movie was found', ()=> {
    page.mockRogueOne();
    page.titleField().type('Rogue');
    page.searchButton().click();
    
    page.previewContainer().should('exist');
  });

  it('should show the add button', () => {
    page.mockRogueOne();
    page.titleField().type('Rogue');
    page.searchButton().click();

    page.addButton()
      .should('exist');
  });

  it('should search for a movie by pressing {enter}', () => {
    page.mockRogueOne();
    page.titleField()
      .type('Rogue')
      .type('{enter}')

    page.previewContainer().should('exist');
  });

  it('should show the preview for the found movie', () => {
    page.mockRogueOne();
    page.titleField().type('Rogue{enter}');

    page.previewTitle()
      .should('have.text', 'Rogue One: A Star Wars Story');

    page.previewDescription()
      .should('contain.text', 'In a time of conflict, a group of unlikely heroes band together on a mission to steal the plans to the Death Star, the Empire\'s ultimate weapon of destruction.');

    page.previewURL()
      .should('have.attr', 'href', 'https://www.imdb.com/title/tt3748528');

    page.previewPoster()
      .should('have.attr', 'src', 'https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SX300.jpg');
  });

  it('should show a preview for another movie', () => {
    page.mockStarTrek();
    page.titleField().type('Star Trek{enter}');

    page.previewTitle()
      .should('have.text', 'Star Trek');

    page.previewDescription()
      .should('contain.text', 'The brash James T. Kirk tries to live up to his father\'s legacy with Mr. Spock keeping him in check as a vengeful Romulan from the future creates black holes to destroy the Federation one planet at a time.');

    page.previewURL()
      .should('have.attr', 'href', 'https://www.imdb.com/title/tt0796366');

    page.previewPoster()
      .should('have.attr', 'src', 'https://m.media-amazon.com/images/M/MV5BMjE5NDQ5OTE4Ml5BMl5BanBnXkFtZTcwOTE3NDIzMw@@._V1_SX300.jpg');
  });

  it('should have the default image if the poster is empty', () => {
    page.mockNoPoster();
    page.titleField().type('Philosopher{enter}');

    page.previewPoster()
      .should('have.attr', 'src', 'https://via.placeholder.com/360x270.png?text=no%20preview');
  });

  it('should not show a preview if a movie is not found', () => {
    page.mockNotFound();
    page.titleField().type('qweqweqwe{enter}');

    page.previewContainer()
      .should('not.exist');
  });

  it('should show the error message if a movie is not found', () => {
    page.mockNotFound();
    page.titleField().type('qweqweqwe{enter}');

    page.errorMessage()
      .should('exist');
  });

  it('should hide the error message after changing the title', () => {
    page.mockNotFound();
    page.titleField().type('qweqweqwe{enter}');
    page.titleField().type('a');

    page.errorMessage()
      .should('not.exist');
  });
});

describe('Add button', () => {
  beforeEach(() => {
    cy.visit('/');
    page.mockRogueOne();
    page.titleField().type('Rogue{enter}');
    page.addButton().click();
  });

  it('should add the found movie to the list', () =>{
    page.movieCards()
      .should('have.length', 1);
  
    page.movieCards()
      .eq(0)
      .find('[data-cy="movieTitle"]')
      .should('have.text', 'Rogue One: A Star Wars Story');
  });

  it('should clear the title field', () => {
    page.titleField().should('have.text', '');
  });

  it('should hide the preview', () => {
    page.previewContainer().should('not.exist');
  });

  it('should hide the add button', () => {
    page.addButton().should('not.exist');
  });

  it('should allow to add one more movie to the list', () =>{
    page.mockStarTrek();
    page.titleField().type('star trek{enter}');
    page.addButton().click();
    page.movieCards()
      .should('have.length', 2);
  
    page.movieCards()
      .eq(1)
      .find('[data-cy="movieTitle"]')
      .should('have.text', 'Star Trek');
  });

  it('should not add a movie twice', () => {
    page.mockRogueOne();
    page.titleField().type('Rogue{enter}');
    page.addButton().click();
    
    page.movieCards().should('have.length', 1);
  });

  it('should clear the form when submitting a duplicated movie', () => {
    page.mockRogueOne();
    page.titleField().type('Rogue{enter}');
    page.addButton().click();

    page.titleField().should('have.text', '');
    page.previewContainer().should('not.exist');
    page.addButton().should('not.exist');
  });
});
