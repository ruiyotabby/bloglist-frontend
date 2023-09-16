describe('Blog app', () => {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user1 = {
      name: 'john',
      username: 'johny',
      password: 'john'
    }

    const user2 = {
      name: 'mike',
      username: 'michael',
      password: 'mike'
    }

    cy.request('POST',  `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST',  `${Cypress.env('BACKEND')}/users`, user2)
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

      cy.get('#root').should('have.descendants', '.blog')
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

      it('A blog can be deleted by the user who created it', function () {
        cy.contains('show').click()
        cy.contains('remove').click()
        cy.get('.success').contains("blog 'a title by cypress an author by cypress' was deleted")
        cy.get('#root').should('not.have.descendants', '.blog')
      })

      it('A blog cannot be deleted by the user who didn\'t created it', function () {
        cy.contains('log out').click()
        cy.wait(300)
        cy.login({ username: 'michael', password: 'mike' })
        cy.contains('show').click()
        cy.get('.blog').should('not.contain', 'remove')
      })
    })

    describe('when many blogs are created', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'the title with the least likes',
          author: 'an author by cypress',
          url: 'a url by cypress'
        })

        cy.createBlog({
          title: 'the title with the second most likes',
          author: 'an author by cypress',
          url: 'a url by cypress'
        })

        cy.createBlog({
          title: 'the title with the most likes',
          author: 'an author by cypress',
          url: 'a url by cypress'
        })
      })

      it('Blogs should be listed according to likes', function () {
        cy.contains('the title with the most likes').parent().as('first')
        cy.get('@first').contains('show').click()

        for (let i = 0; i < 3; i++) {
          cy.get('@first').contains( 'button', 'like').click()
          cy.wait(800)
        }

        cy.contains('the title with the second most likes').parent().as('second')
        cy.get('@second').contains('show').click()
        cy.get('@second').contains( 'button', 'like').click()

        cy.get('.blog').eq(0).should('contain', 'the title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'the title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'the title with the least likes')
      })
    })
  })
})