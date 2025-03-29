// cypress/integration/demoblaze.spec.js

describe('Demoblaze E2E Tests', () => {
  const baseUrl = 'https://www.demoblaze.com/index.html';
  const username = `user${Date.now()}`; // Unique username or else the web page does not allow to create duplicate usernames
  const password = 'Test@123';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it.skip('should create an account, login, add products, validate amounts, delete a product, and place an order', () => {
    // CREATE AN ACCOUNT
    cy.get('#navbarExample').should('be.visible'); // We need to make sure that the parent element is visible/rendered for the following actions
    cy.get('#signin2').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('#sign-username').clear().type(username); //.clear is added to clear the existing data in the placeholder
    cy.get('#sign-password').clear().type(password);
    cy.get('button').contains('Sign up').click(); //using contains because of no unique locator
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Sign up successful.');
    });
    cy.get('.modal-content').should('not.be.visible');
  });

  // LOGIN
  it('should login an account, login, add products, validate amounts, delete a product, and place an order', () => {
    cy.get('#navbarExample').should('be.visible');
    cy.get('#login2').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('#loginusername').clear().type('princiya');
    cy.get('#loginpassword').clear().type('princiya123');
    cy.get('button').contains('Log in').click();
    cy.wait(1000);
    cy.get('.modal-content').should('not.be.visible');
    cy.contains('#nameofuser', 'princiya');

    // ADD 3 PRODUCTS TO THE CART
    const productsToAdd = ['Samsung galaxy s6', 'Nokia lumia 1520', 'Nexus 6'];
    productsToAdd.forEach((product) => {  // loops all elements in array above until all 3 products are added
      cy.contains(product).click();
      cy.intercept('POST', '**/addtocart').as('addToCart');
      cy.get('.btn.btn-success.btn-lg').contains('Add to cart').click(); //3 dots in classname is because we have 3 different class and space is not a valid loactor
      cy.wait('@addToCart'); 
      cy.on('window:alert', (str) => {
        expect(str).to.contain('Product added.');
      });
      cy.get('#nava').contains('PRODUCT STORE').click();
    });

    // VALIDATE TOTAL
    cy.contains('Cart').click();
    let initialTotal = 0;
    cy.get('tr.success').each(($row) => {
      cy.wrap($row).find('td').eq(2).invoke('text').then((priceText) => { //invoke for exact text
        initialTotal += parseInt(priceText); // initialTotal will have the value new value and keeps adding as new product value is calculated
      });
    }).then(() => {
      cy.get('#totalp').should('have.text', `${initialTotal}`); //getting the exact value in the total
    });

    // DELETE FIRST PRODUCT AND VALIDATE THE AMOUNT AGAIN
    cy.intercept('POST', '**/deleteitem').as('deleteItem'); // intercept deletion
    cy.intercept('POST', '**/viewcart**').as('viewCart');    // cart reload after deletion

    let newTotal = 0; //Initialized to store the new value after deletion
    cy.get('tr.success').first().within(() => {
      cy.contains('Delete').click();
    });
    cy.wait('@deleteItem');  // wait for delete API to complete
    cy.wait('@viewCart');    // wait for the cart to be updated
    cy.get('tr.success').each(($row) => {
      cy.wrap($row).find('td').eq(2).invoke('text').then((priceText) => {
        newTotal += parseInt(priceText);
      });
    }).then(() => {
      expect(newTotal).to.be.lessThan(initialTotal); //validating new value to be less than tht total before deleting
      cy.get('#totalp').should('have.text', `${newTotal}`);
    });

    // PLACE THE ORDER
    cy.contains('Place Order').click();
    // Make sure the order modal is visible
    cy.get('#orderModal').should('be.visible');
    // Fill in the form
    cy.get('#name').type('Princiya R');
    cy.get('#country').type('Germany');
    cy.get('#city').type('Paderborn');
    cy.get('#card').type('1234-5678-9012-3456');
    cy.get('#month').type('03');
    cy.get('#year').type('2025');
    cy.contains('Purchase').click();

    // CONFIRMATION
    cy.get('.sweet-alert')
      .should('be.visible')
      .and('contain', 'Thank you for your purchase!')
      .then(() => {
        cy.contains('OK').click();
      });
  });

  // Additional Positive Test login for another user
  it('should login with valid credentials', () => {
    cy.get('#navbarExample').should('be.visible');
    cy.get('#login2').click();
    cy.get('.modal-content').should('be.visible');
    cy.get('#loginusername').clear().type('princiya1');
    cy.get('#loginpassword').clear().type('princiya1234');
    cy.get('button').contains('Log in').click();
    cy.wait(1000);
    cy.get('.modal-content').should('not.be.visible');
    cy.contains('#nameofuser', 'princiya1')
  });

  // Negative Test: Invalid Credentials
  it('should not login with invalid credentials', () => {
    cy.get('#login2').click();
    cy.get('#logInModal').should('be.visible');
    cy.get('#loginusername').type('Ghibly6');
    cy.get('#loginpassword').type('Ghibly9');
    cy.get('button').contains('Log in').click();
    cy.on('window:alert', (str) => {
      expect(str).to.contain('User does not exist.');
    });
    cy.contains('Welcome').should('not.exist');
  });

  // Negative Test: Place order with empty cart
  it('should not place an order when cart is empty', () => {
    cy.get('#navbarExample').should('be.visible');
    cy.contains('Cart').click();
    // Attempt to place order
    cy.contains('Place Order').click();
    cy.get('#orderModal').should('be.visible');
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Please fill out Name and Creditcard.');
    });
  });
});
// cy.get('#sign-username').type(Cypress.env('USER_NAME'));
// cy.get('#sign-password').type(Cypress.env('PASSWORD'));