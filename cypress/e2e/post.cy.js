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

    context('quando não preencho todos os campos obrigatórios', function(){
       
        const characters = [
            {
                name: '',
                alias: 'Professor X',
                team: ['x-men', 'vingadores'],
                active: true
            },
            {
                alias: 'Professor X',
                team: ['x-men', 'vingadores'],
                active: true
            },
            {
                name: 'Charles Xavier',
                alias: '',
                team: ['x-men', 'vingadores'],
                active: true
            },
            {
                name: 'Charles Xavier',
                team: ['x-men', 'vingadores'],
                active: true
            },
            {
                name: 'Charles Xavier',
                alias: 'Professor X',
                team: '',
                active: true
            },
            {
                name: 'Charles Xavier',
                alias: 'Professor X',
                active: true
            },
            {
                name: 'Charles Xavier',
                alias: 'Professor X',
                team: ['x-men', 'vingadores']
            }   
        
        ]    

        characters.forEach(function(pay){
            it('não deve cadastrar personagem', function(){
                cy.postCharacter(pay).then(function(response){
                    expect(response.status).to.eql(400)
                    cy.log(response.body.validation.body.message)
                    const message = response.body.validation.body.message
                    const hasItemDetails = (message.includes('is required')) || (message.includes('is not allowed to be empty') || message.includes ('must be an array'))
                    expect(hasItemDetails).to.be.true

                }) 
            })
        })
    })
       
       
    context('quando o personagem já existe', function(){
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