/// <reference types="cypress"/>

describe ('POST /characters', function(){

    before(function(){
        
        cy.back2ThePast()
        cy.setToken()
        
    })

    it('deve cadastrar um personagem', function(){

        const character = {
            name:"Wanda Maxioff",
            alias:"Feiticeira Escarlate",
            team: ["x-men"],
            active:true
        }

        cy.postCharacter(character).then(function(response){
            expect(response.status).to.eql(201)
            cy.log(response.body.character_id)
            expect(response.body.character_id.length).to.eql(24)
        })

    })

    context('Quando não preencho todos os campos obrigatórios', function(){
       
        const characters = [
            {
                name: '',
                alias: 'Thor',
                team: ['vingadores'],
                active: true
            },
            {
                alias: 'Thor',
                team: ['vingadores'],
                active: true
            },
            {
                name: 'Thor',
                alias: '',
                team: ['vingadores'],
                active: true
            },
            {
                name: 'Thor',
                team: ['vingadores'],
                active: true
            },
            {
                name: 'Thor',
                alias: 'Thor',
                team: '',
                active: true
            },
            {
                name: 'Thor',
                alias: 'Thor',
                active: true
            },
            {
                name: 'Thor',
                alias: 'Thor',
                team: ['vingadores']
            }   
        
        ]    

        characters.forEach(function(payload){
            it('não deve cadastrar um personagem', function(){
                cy.postCharacter(payload).then(function(response){
                    expect(response.status).to.eql(400)
                    const message = response.body.validation.body.message
                    const item = (message.includes('is required')) || (message.includes('is not allowed to be empty') || message.includes ('must be an array'))
                    expect(item).to.be.true

                }) 
            })
        })
    })
       
       
    context('Quando o personagem já existe', function(){
        const character = {
            name: 'Pietro Maxioff',
            alias: 'Mercurio',
            team: [
                'vingadores da costa oeste', 
                'irmandade de mutantes'
            ],
            active: true
        }

        before(function(){
            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(201)
            })

        })

        it('não deve cadastrar personagem duplicado', function(){
            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql('Duplicate character')
            })

        })


    })
})