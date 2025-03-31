// cypress/integration/demoblaze.spec.js
describe('Demoblaze E2E Tests', () => {
  const baseUrl = 'https://www.demoblaze.com/index.html';

  beforeEach(() => {
    cy.visit(baseUrl);
  });
 
  it('should create an account, login, add products, validate amounts, delete a product, and place an order', () => {
    // CREATE AN ACCOUNT
    const username = `user${Date.now()}`; // Unique username or else the web page does not allow to create duplicate usernames
    const password = 'Test@123';
    cy.get('#navbarExample').should('be.visible'); // We need to make sure that the parent element is visible/rendered for the following actions
    cy.get('#signin2').click();
    cy.wait(2000) // Wait for the modal to appear
    cy.get('.modal-content').should('be.visible');
    cy.get('#sign-username').clear().type(username); //.clear is added to clear the existing data in the placeholder
    cy.get('#sign-password').clear().type(password);
    cy.get('button').contains('Sign up').click(); //using contains because of no unique locator
 
  
  // LOGIN
    cy.wait(2000)
    cy.get('#navbarExample').should('be.visible'); 
    cy.get('#login2').click();
    cy.get('.modal-content').should('be.visible');
    cy.wait(2000)
    cy.get('#loginusername').clear().type(username);
    cy.get('#loginpassword').clear().type(password);
    cy.get('button').contains('Log in').click();
    cy.contains('#nameofuser', username); // Verify that the logged-in username is displayed
  
    // ADD 3 PRODUCTS TO THE CART
    const productsToAdd = ['Samsung galaxy s6', 'Nokia lumia 1520', 'Nexus 6']; // List of products to add to cart
    productsToAdd.forEach((product) => {  // loops all elements in array above until all 3 products are added
      cy.contains(product).click();
      cy.intercept('POST', '**/addtocart').as('addToCart'); // Intercept the POST request to add a product to the cart
      cy.wait(2000)
      cy.get('.btn.btn-success.btn-lg').contains('Add to cart').click(); //3 dots in classname is because we have 3 different class and space is not a valid locator
      cy.wait('@addToCart'); // Wait for the "add to cart" API request to complete
      cy.wait(2000) // Wait for the page to update
      cy.get('#nava').contains('PRODUCT STORE').click();
    });

    // VALIDATE TOTAL
    cy.contains('Cart').click();
    cy.wait(2000) // Wait for the cart page to load
    const expectedTotalAfterAdd = 1830; // Expected total after adding products
    const expectedTotalAfterDelete = 1470; // Expected total after deleting a product

    let actualTotalAfterAdd = 0; // Initialize actual total after adding products
    let actualTotalAfterDelete = 0; // Initialize actual total after deleting a product

    cy.get('tr.success').each(($row) => { // Loop through each row in the cart
      cy.wrap($row).find('td').eq(2).invoke('text').then((priceText) => { //invoke for exact text
        actualTotalAfterAdd += parseInt(priceText); // initialTotal will have the value new value and keeps adding as new product value is calculated
      });
    }).then(() => {
      if (expectedTotalAfterAdd === actualTotalAfterAdd){
      cy.log('Total is correct');
      cy.get('#totalp').should('have.text', `${expectedTotalAfterAdd}`); 
    }
    else {
      cy.log('Total is incorrect');
      expect(expectedTotalAfterAdd).to.equal(actualTotalAfterAdd); // This will fail the test case and stop the execution
    }
    });

    // DELETE PRODUCT AND VALIDATE THE AMOUNT AGAIN
    cy.intercept('POST', '**/deleteitem').as('deleteItem'); // intercept deletion
    cy.intercept('POST', '**/viewcart**').as('viewCart');    // cart reload after deletion

    cy.get('tr.success').contains('Samsung galaxy s6').closest('tr').contains('Delete').click()  // Delete a product from the cart
    cy.wait('@deleteItem');  // wait for delete API to complete
    cy.wait('@viewCart');    // wait for the cart to be updated
    cy.wait(2000)
    cy.get('tr.success').each(($row) => {
      cy.wrap($row).find('td').eq(2).invoke('text').then((priceText) => {
        actualTotalAfterDelete += parseInt(priceText);
      });
    }).then(() => {
      expect(actualTotalAfterDelete).to.equal(expectedTotalAfterDelete); // Verify that the total after deletion matches the expected value
      cy.get('#totalp').should('have.text', `${expectedTotalAfterDelete}`);
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
    cy.get('#loginusername').type('Ghibly6'); // Type an invalid username
    cy.get('#loginpassword').type('Ghibly9'); // Type an invalid password
    cy.get('button').contains('Log in').click();
    cy.on('window:alert', (str) => {
      expect(str).to.contain('User does not exist.');
    });
    cy.contains('Welcome').should('not.exist'); // Ensure that the "Welcome" message does not appear
  });

  // Negative Test: Place order with empty cart
  it('should not place an order when cart is empty', () => {
    cy.get('#navbarExample').should('be.visible');
    cy.contains('Cart').click();
    // Attempt to place order
    cy.contains('Place Order').click();
    cy.get('#orderModal').should('be.visible');
    cy.on('window:alert', (str) => {
      expect(str).to.contain('Please fill out Name and Creditcard.'); // Verify that the alert contains the appropriate message
    });
  });
});
