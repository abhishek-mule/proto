describe('Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains('Welcome Back'); // Or any other text that appears on your login page
  });
});
