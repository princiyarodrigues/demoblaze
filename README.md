# Demoblaze End-to-End (E2E) Test Suite

This repository contains a set of end-to-end (E2E) tests for the Demoblaze website using Cypress. The tests simulate a user creating an account, logging in, adding products to the cart, validating the cart total, deleting a product, placing an order, and confirming successful transactions. Additionally, there are tests for logging in with valid and invalid credentials and placing orders with an empty cart.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Test Cases](#test-cases)
  - [Create Account and Login](#create-account-and-login)
  - [Add Products to Cart and Validate Total](#add-products-to-cart-and-validate-total)
  - [Delete Product and Revalidate Total](#delete-product-and-revalidate-total)
  - [Place Order and Confirm](#place-order-and-confirm)
  - [Login with Valid Credentials](#login-with-valid-credentials)
  - [Login with Invalid Credentials](#login-with-invalid-credentials)
  - [Place Order with Empty Cart](#place-order-with-empty-cart)


## Installation

Follow the steps below to set up and run the Cypress test suite:

1. **Clone this repository:**

    ```bash
    git clone https://github.com/princiyarodrigues/demoblaze.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd demoblaze
    ```

3. **Install dependencies:**

    Ensure that Node.js and npm are installed on your machine. Then run the following command to install the required packages:

    ```bash
    npm install
    ```

4. **Start Cypress:**

    To open Cypress and run the tests interactively:

    ```bash
    npx cypress open
    ```

    This will open the Cypress test runner where you can select the tests you want to run.

## Prerequisites

- **Node.js**: Ensure that you have [Node.js](https://nodejs.org/) installed (version 12 or higher).
- **Cypress**: The Cypress framework will be automatically installed via `npm install`.

## Test Cases

The following tests are included in the suite:

### Create Account and Login

- **Description**: This test creates a new account with a dynamically generated username and a predefined password. Afterward, it logs in using the created credentials.
- **Expected Result**: The account should be created successfully, and the user should be logged in.

### Add Products to Cart and Validate Total

- **Description**: This test adds three products to the cart, validates the total amount of the products in the cart, and compares it to the expected total.
- **Expected Result**: The total amount should match the expected value after the products are added.

### Delete Product and Revalidate Total

- **Description**: This test deletes one product from the cart and re-validates the total amount in the cart.
- **Expected Result**: The total after the product deletion should match the expected value.

### Place Order and Confirm

- **Description**: This test simulates placing an order after filling out the necessary billing information.
- **Expected Result**: The order should be successfully placed, and a confirmation message should appear.

### Login with Valid Credentials

- **Description**: This test logs in with a predefined valid username and password.
- **Expected Result**: The login should be successful, and the user should be logged in.

### Login with Invalid Credentials

- **Description**: This test attempts to log in with invalid credentials.
- **Expected Result**: An error message should be displayed indicating the credentials are invalid.

### Place Order with Empty Cart

- **Description**: This test attempts to place an order when the cart is empty.
- **Expected Result**: An error message should be shown indicating that the cart is empty.

## Running Tests

To run the tests, follow these steps:

1. **Open Cypress**:

    ```bash
    npx cypress open
    ```

    This will open the Cypress Test Runner, and you can choose the tests you want to run.

2. **Run Tests in Headless Mode**:

    If you want to run the tests without opening the Cypress UI, use the following command:

    ```bash
    npx cypress run
    ```

    This will run all the tests in the terminal and provide a summary of the results.

