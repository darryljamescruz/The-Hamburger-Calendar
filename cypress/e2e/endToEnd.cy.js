describe("Acceptance Tests", () => {
  // FEATURE: USER SIGN-IN
  it("Tests Login Features", () => {
    /* Background:
     * Given I have opened the website for the first time
     * Then I will be prompted to sign in
     */

    cy.visit("http://localhost:8000/login");

    /* Scenario: Successful sign in
     * Given I enter a registered email and password
     * When I click “Sign in”
     * Then I should have successfully logged in
     * And been redirected to the main calendar page
     */

    // Check for successful login with valid email & password
    cy.get(".mt-2 input").first().type("test@test.com");
    cy.get(".mt-2 input").first().should("have.value", "test@test.com");

    cy.get(".mt-2 input").last().type("1!Aaaaaa");
    cy.get(".mt-2 input").last().should("have.value", "1!Aaaaaa");

    // Sign in
    cy.contains("button", "Sign in").last().click();
    cy.url().should("include", "/month");

    // Return back to sign-in page
    cy.visit("http://localhost:8000/login");

    /* Scenario: Wrong Username
     * Given I enter a non-registered email and password
     * When I click “Sign in”
     * Then I should not be logged in
     * And not been redirected to the main calendar page
     */

    // Check for unsuccessful login with unregistered email & valid password
    cy.get(".mt-2 input").first().type("newemail@test.com");
    cy.get(".mt-2 input").first().should("have.value", "newemail@test.com");

    cy.get(".mt-2 input").last().type("1!Aaaaaa");
    cy.get(".mt-2 input").last().should("have.value", "1!Aaaaaa");

    // Sign in (should be unsuccessful)
    cy.contains("button", "Sign in").last().click();
    cy.contains("Error: Account does not exist.");

    // Return back to sign-in page (just in case)
    cy.visit("http://localhost:8000/login");

    /* Scenario: Wrong Password
     * Given I enter a registered email and invalid password
     * When I click “Sign in”
     * Then I should not be logged in
     * And not been redirected to the main calendar page
     */

    // Check for unsuccessful login with unregistered email & valid password
    cy.get(".mt-2 input").first().type("test@test.com");
    cy.get(".mt-2 input").first().should("have.value", "test@test.com");

    cy.get(".mt-2 input").last().type("wrong_password");
    cy.get(".mt-2 input").last().should("have.value", "wrong_password");

    // Sign in (should be unsuccessful)
    cy.contains("button", "Sign in").last().click();
    cy.contains("Invalid password. Please try again.");

    // Return back to sign-in page (just in case)
    cy.visit("http://localhost:8000/login");
  });

  // FEATURE: USER SIGN-UP
  it("Tests Sign-up Features", () => {
    /* Background:
     * Given I have opened the website for the first time
     * Then I will be prompted to sign up
     */

    cy.visit("http://localhost:8000/register");

    /* Scenario: Successful sign-up
     * Given I enter a name, email, password, & confirm password
     * And my password is between 8–32 characters (inclusive), containing at least one capital letter, lowercase letter, number, and special symbol
     * And my password and confirmed password match
     * When I click “Sign Up"
     * Then I should have successfully created a new account
     * And been logged in
     * And been redirected to the main calendar page
     */

    // Check for successful login with valid email & password
    cy.get(".mt-2 input").eq(0).type("Test Account");
    cy.get(".mt-2 input").eq(0).should("have.value", "Test Account");

    cy.get(".mt-2 input").eq(1).type("test@email.com");
    cy.get(".mt-2 input").eq(1).should("have.value", "test@email.com");

    cy.get(".mt-2 input").eq(2).type("Testpassword123*");
    cy.get(".mt-2 input").eq(2).should("have.value", "Testpassword123*");

    cy.get(".mt-2 input").eq(3).type("Testpassword123*");
    cy.get(".mt-2 input").eq(3).should("have.value", "Testpassword123*");

    // Sign up
    cy.contains("button", "Sign up").last().click();
    cy.url().should("include", "/month");

    // Return back to sign-in page
    cy.visit("http://localhost:8000/register");

    /* Scenario: Email already exists
     * Given I enter a name, email, password, & confirm password
     * And my password is between 8–32 characters (inclusive), containing at least one capital letter, lowercase letter, number, and special symbol
     * And the email I entered already exists in the database
     * When I click “Sign Up"
     * Then I should receive an error message telling me the email I chose already exists in the system
     * And no new account should be created
     * And I should not be signed in or redirected
     */

    // Check for unsuccessful sign-up with previously-registered email & valid password
    cy.get(".mt-2 input").eq(0).type("Test Account");
    cy.get(".mt-2 input").eq(0).should("have.value", "Test Account");

    cy.get(".mt-2 input").eq(1).type("test@email.com");
    cy.get(".mt-2 input").eq(1).should("have.value", "test@email.com");

    cy.get(".mt-2 input").eq(2).type("Testpassword123*");
    cy.get(".mt-2 input").eq(2).should("have.value", "Testpassword123*");

    cy.get(".mt-2 input").eq(3).type("Testpassword123*");
    cy.get(".mt-2 input").eq(3).should("have.value", "Testpassword123*");

    // Sign up (should be unsuccessful)
    cy.contains("button", "Sign up").last().click();
    cy.contains("Error: Email already taken.");

    // Return back to sign-in page (just in case)
    cy.visit("http://localhost:8000/register");

    /* Scenario: Password doesn't match requirements
     * Given I enter a name, email, password, & confirm password
     * And my password does not meet the following requirements: being between 8–32 characters (inclusive), containing at least one capital letter, lowercase letter, number, and special symbol
     * When I click “Sign Up"
     * Then I should receive an error message telling me the password I chose does not meet the required specs, and print the specs for me to see
     * And no new account should be created
     * And I should not be signed in or redirected
     */

    // Check for unsuccessful login with unregistered email & valid password
    cy.get(".mt-2 input").eq(0).type("Test Account");
    cy.get(".mt-2 input").eq(0).should("have.value", "Test Account");

    cy.get(".mt-2 input").eq(1).type("test@email.com");
    cy.get(".mt-2 input").eq(1).should("have.value", "test@email.com");

    cy.get(".mt-2 input").eq(2).type("invalidpwd");
    cy.get(".mt-2 input").eq(2).should("have.value", "invalidpwd");

    cy.get(".mt-2 input").eq(3).type("invalidpwd");
    cy.get(".mt-2 input").eq(3).should("have.value", "invalidpwd");

    // Sign up (should be unsuccessful)
    cy.contains("button", "Sign up").last().click();
    cy.contains(
      "Password must be between 8 and 32 characters, contain an uppercase character, a lowercase character, a number, and a special character."
    );

    // Return back to sign-in page (just in case)
    cy.visit("http://localhost:8000/register");

    /* Scenario: Password and Confirm Password don't match
     * Given I enter a name, email, password, & confirm password
     * And my password is between 8–32 characters (inclusive), containing at least one capital letter, lowercase letter, number, and special symbol
     * And my password and Confirm Password fields DON'T match
     * When I click “Sign Up"
     * Then I should receive an error message telling me the password I chose does not match my confirmed password
     * And no new account should be created
     * And I should not be signed in or redirected
     */

    // Check for unsuccessful login with unregistered email & valid password
    cy.get(".mt-2 input").eq(0).type("Test Account");
    cy.get(".mt-2 input").eq(0).should("have.value", "Test Account");

    cy.get(".mt-2 input").eq(1).type("test@email.com");
    cy.get(".mt-2 input").eq(1).should("have.value", "test@email.com");

    cy.get(".mt-2 input").eq(2).type("Testpassword123*");
    cy.get(".mt-2 input").eq(2).should("have.value", "Testpassword123*");

    cy.get(".mt-2 input").eq(3).type("OtherTestpassword123*");
    cy.get(".mt-2 input").eq(3).should("have.value", "OtherTestpassword123*");

    // Sign up (should be unsuccessful)
    cy.contains("button", "Sign up").last().click();
    cy.contains("Error: Password and confirmed password don't match.");

    // Return back to sign-in page (just in case)
    cy.visit("http://localhost:8000/register");

    // Now delete account
    cy.visit("http://localhost:8000/login");

    cy.get(".mt-2 input").first().type("test@email.com");
    cy.get(".mt-2 input").first().should("have.value", "test@email.com");

    cy.get(".mt-2 input").last().type("Testpassword123*");
    cy.get(".mt-2 input").last().should("have.value", "Testpassword123*");

    // Sign in
    cy.contains("button", "Sign in").last().click();
    cy.url().should("include", "/month");

    // Navigate to settings page
    cy.visit("http://localhost:8000/settings");  // use relative path when running local!

    cy.contains("button", "Delete Account").first().click();
    cy.contains("button", "Confirm Delete").first().click();
  });
});
