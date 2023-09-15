describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'john',
      username: 'johny',
      password: 'john'
    }
    cy.request('POST',  `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
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

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'johny', password: 'john' })
    })

    it('A blog can be created', function () {
      cy.contains('Create new blog').click()
      cy.get('[name=title]').type('a title by cypress')
      cy.get('[name=author]').type('an author by cypress')
      cy.get('[name=url]').type('a url by cypress')
      cy.contains('create').click()

      cy.get('.success').contains("'a title by cypress' by 'an author by cypress' added")
      cy.contains('a title by cypress an author by cypress')
    })

    describe('when a blog is created', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a title by cypress',
          author: 'an author by cypress',
          url: 'a url by cypress'
         })
      })

      it('A blog can be liked', function () {
        cy.contains('show').click()
        cy.contains('like').click()

        cy.get('#likes').contains(1)
      })
    })
  })
})