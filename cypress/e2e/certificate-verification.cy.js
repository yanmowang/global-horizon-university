describe('Certificate Verification', () => {
  beforeEach(() => {
    // Visit the certificate verification page
    cy.visit('/verify-certificate');
  });

  it('displays the verification form', () => {
    cy.contains('h1', 'Certificate Verification');
    cy.get('input[placeholder*="certificate number"]').should('be.visible');
    cy.get('button').contains('Verify Certificate').should('be.visible');
  });

  it('shows validation error when no certificate number is entered', () => {
    cy.get('button').contains('Verify Certificate').click();
    cy.contains('Please enter a certificate number').should('be.visible');
  });

  it('shows error message for invalid certificate', () => {
    // Intercept API call and mock response for invalid certificate
    cy.intercept('GET', '/api/certificates/verify/*', {
      statusCode: 200,
      body: {
        success: true,
        valid: false,
        message: 'Certificate not found',
      },
    }).as('verifyInvalid');

    // Enter invalid certificate number
    cy.get('input[placeholder*="certificate number"]').type('INVALID-12345');
    cy.get('button').contains('Verify Certificate').click();

    // Wait for API call
    cy.wait('@verifyInvalid');

    // Check error message is displayed
    cy.contains('Invalid certificate').should('be.visible');
  });

  it('displays certificate details for valid certificate', () => {
    // Intercept API call and mock response for valid certificate
    cy.intercept('GET', '/api/certificates/verify/*', {
      statusCode: 200,
      body: {
        success: true,
        valid: true,
        data: {
          certificateNumber: 'GHU-BA-2023-123456',
          program: 'Computer Science',
          certificateType: 'bachelor',
          issueDate: '2023-07-15',
          status: 'issued',
          metadata: {
            graduationDate: '2023-05-20',
            gpa: 3.8,
            honors: 'Cum Laude',
          },
          recipientName: 'John Doe',
        },
      },
    }).as('verifyValid');

    // Enter valid certificate number
    cy.get('input[placeholder*="certificate number"]').type('GHU-BA-2023-123456');
    cy.get('button').contains('Verify Certificate').click();

    // Wait for API call
    cy.wait('@verifyValid');

    // Check certificate details are displayed
    cy.contains('Certificate is Valid').should('be.visible');
    cy.contains('John Doe').should('be.visible');
    cy.contains('Computer Science').should('be.visible');
    cy.contains('Bachelor').should('be.visible');
  });
});
