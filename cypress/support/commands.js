Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Rennan')
    cy.get('#lastName').type('Oliveira')
    cy.get('#email').type('rennan.oliveira@itmss.com.br')
    cy.get('#open-text-area').type('teste') 
    cy.contains('button', 'Enviar').click()
})