/// <reference types="cypress"/>
describe ('DELETE /characters', function(){

    const character = {
        name: 'Bruce Banner',
        alias: 'Hulk',
        team: [
            'vingadores'
        ],
        active: true
    }

    before(function(){

        cy.setToken()

        cy.postCharacter(character).then(function(response){
            expect(response.status).to.eql(201)
        })

        cy.getCharacterByName("Bruce Banner").then(function(response){
            Cypress.env('id_hulk', response.body[0]['_id']) 
        })

    })

    it('Deve poder remover por id, um personagem cadastrado', function(){

        cy.deleteCharacterByID(Cypress.env('id_hulk')).then(function(response){
            expect(response.status).to.eql(204)
        })

    })

    context('Validation failed', function(){

        it('Deve retornar não encontrado ao remover por id não cadastrado', function(){

            cy.deleteCharacterByID("62dfee6d5325c20016337fff").then(function(response){
                expect(response.status).to.eql(404)
            })

        })

        it('Quando ao remover um personagem, o tamanho do ID não é o correto', function(){

            cy.deleteCharacterByID("62d07c5da8facc001644cac").then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.params.message).to.eql('"character_id" length must be 24 characters long')
            })
            
        })

    })
   
    
})