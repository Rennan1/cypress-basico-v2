
/// <reference types="Cypress" />
describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){ /// O beforeEach cria uma condição para ser utilizada antes de cada teste.
        cy.visit ('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT') /// cy.title() olha para o título da página, should('be equal', 'título passado') verifica se o título é igual ao informado. 
    })

    it('preenche os campos obrigatórios e envia o formulário', function(){

        const textoLongo = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys.Teste, teste, teste, teste, teste, teste'
        cy.get('#firstName').type('Rennan')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('rennan.oliveira@itmss.com.br')
        cy.get('#open-text-area').type(textoLongo, {delay: 0}) 
        cy.contains('button', 'Enviar').click()
        cy.get('.success > strong').should('be.visible')

    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        const textoLongo = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys.Teste, teste, teste, teste, teste, teste'
        cy.get('#firstName').type('Rennan')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('rennan.oliveira@itmss.com,br') ///email inválido
        cy.get('#open-text-area').type(textoLongo, {delay: 0}) 
        cy.contains('button', 'Enviar').click()
        cy.get('.error')
    })

    it ('validação de campo vazio no campo telefone quando preenchido com valores não-numéricos', function(){
        cy.get('#phone').type('texto').should('have.value', '')
    })
///Validação de erro
    it ('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Rennan')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('rennan.oliveira@itmss.com.br')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Teste') 
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })
    it ('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Rennan').should('have.value', 'Rennan').clear().should('have.value', '') /// escrever o campo, validar que tá escrito, apagar e validar que apagou
        cy.get('#lastName').type('Oliveira').should('have.value', 'Oliveira').clear().should('have.value','')
        cy.get('#email').type('rennan.oliveira@itmss.com.br').should('have.value', 'rennan.oliveira@itmss.com.br').clear().should('have.value','')
        cy.get('#phone').type('1199999999').should('have.value', '1199999999').clear().should('have.value', '')
    })

    it ('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success > strong').should('be.visible')
    })
///Seleção de Produto (Select)
    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value', 'blog')
    })
///Radio
    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type=radio][value=feedback]').check().should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type=radio]').should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })
///Checkbox
    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

///Upload de Arquivo
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}) ///colocando como segundo argumento no selectFile a ação de drag-drop, para fazer a simulação de ação
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })
    
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
        .selectFile('@sampleFile')
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a') ///estamos olhando para a div com id privacy onde dentro da div temos um a
        .should('have.attr', 'target', '_blank') ///estamos passando o comando have.attr para verificar que tem o atributo target e estamos olhando se tem o target _blank
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a').invoke('removeAttr', 'target').click() ///com o invoke estamos removendo o Attr target e estamos clicando no link selecionado pelo get com .click()
        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
    })
})