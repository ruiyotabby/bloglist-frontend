describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'john',
      username: 'johny',
      password: 'john'
    }
    cy.request('POST',  'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.get('form').get('[name=username]').should('have.value', '')
    cy.get('form').get('[name=password]').should('have.value', '')
    cy.get('form').contains('username')
    cy.get('form').contains('password')
    cy.get('form').get('button').contains('Login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('[name=username]').type('johny')
      cy.get('[name=password]').type('john')
      cy.get('[type=submit]').click()

      cy.contains('john logged in')
      cy.get('.success').contains('john signed in successfully')
    })

    it('fails with invalid credentials', function () {
      cy.get('[name=username]').type('johny')
      cy.get('[name=password]').type('wrong')
      cy.get('[type=submit]').click()

      cy.get('.error').contains('Incorrect username or password')
      cy.contains('Incorrect username or password').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
})