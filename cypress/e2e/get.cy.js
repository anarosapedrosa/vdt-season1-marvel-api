/// <reference types="cypress"/>
describe (' GET /characters', function(){

    before(function(){
        cy.setToken()
    })

    it('Deve retornar uma lista de personagens cadastrados', function(){

        cy.getCharacters().then(function(response){
            expect(response.status).to.eql(200)
            Cypress.env('id', response.body[0]["_id"])
        })

    })

    it('Deve poder buscar por personagem por nome', function(){

        cy.getCharacterByName("Wanda Maxioff").then(function(response){
            expect(response.status).to.eql(200)
        })

    })

    it('Deve poder buscar por personagem por ID', function(){

        cy.getCharacterByID(Cypress.env('id')).then(function(response){
            expect(response.status).to.eql(200)
            cy.log(Cypress.env('id'))
        })

    })

    context('Validation failed', function(){
        
        it('Quando a busca do personagem por ID não existe', function(){
            cy.getCharacterByID("62d07c5d5a8facc001644cac").then(function(response){
                expect(response.status).to.eql(404)
            })
        })

        
        it('Quando o tamanho do ID não é o correto', function(){
            cy.getCharacterByID("62d07c5da8facc001644cac").then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.params.message).to.eql('"character_id" length must be 24 characters long')
            })
        })


    })
    
})