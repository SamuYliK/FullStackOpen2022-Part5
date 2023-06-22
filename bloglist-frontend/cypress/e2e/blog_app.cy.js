describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Test Tester',
      username: 'Test User',
      password: 'Top secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function(){
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('Test User')
      cy.get('#password').type('Top secret')
      cy.get('#login-button').click()

      cy.contains('Test Tester logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('Test User')
      cy.get('#password').type('Not so secret')
      cy.get('#login-button').click()

      cy.get('.error')
        .contains('wrong username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Test Tester logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('Test User')
      cy.get('#password').type('Top secret')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title-input').type('A blog created by cypress')
      cy.get('#author-input').type('Cypress Author')
      cy.get('#url-input').type('notrealadress.com')
      cy.get('#submit-blog-button').click()
      cy.get('.blog')
        .contains('A blog created by cypress')
    })

    describe('When logged in and blog exists', function() {
      beforeEach(function() {
        cy.contains('create new blog').click()
        cy.get('#title-input').type('A blog created by cypress')
        cy.get('#author-input').type('Cypress Author')
        cy.get('#url-input').type('notrealadress.com')
        cy.get('#submit-blog-button').click()
      })

      it('A blog can be liked', function() {
        cy.get('.blog')
          .contains('A blog created by cypress')
          .contains('view').click()

        cy.get('.blog')
          .contains('A blog created by cypress')
          .parent()
          .contains('likes 0')

        cy.get('.blog')
          .contains('A blog created by cypress')
          .parent()
          .find('button')
          .contains('like')
          .click()

        cy.get('.blog')
          .contains('A blog created by cypress')
          .parent()
          .contains('likes 1')
      })

      it('A blog can be removed by person who added it', function() {
        cy.get('.blog')
          .contains('A blog created by cypress')
          .contains('view').click()

        cy.get('.blog')
          .contains('A blog created by cypress')
          .parent()
          .find('button')
          .contains('remove')
          .click()

        cy.get('.blog')
          .should('not.exist')

      })

      it('Only person who added blog can remove it', function() {
        // Log out with test user
        cy.contains('logout').click()
        // Create other user
        const otherUser = {
          name: 'Other User',
          username: 'Other User',
          password: 'Top secret'
        }
        cy.request('POST', 'http://localhost:3003/api/users', otherUser)
        cy.visit('http://localhost:3000')
        // Log in with other user
        cy.get('#username').type('Other User')
        cy.get('#password').type('Top secret')
        cy.get('#login-button').click()
        // Show all blog details
        cy.get('.blog')
          .contains('A blog created by cypress')
          .contains('view').click()
        // Check that remove button is not visible for user
        cy.get('.blog')
          .contains('A blog created by cypress')
          .parent()
          .contains('remove')
          .should('be.not.visible')
      })

      describe('When logged in and several blogs exist', function () {
        beforeEach(function() {
          cy.contains('create new blog').click()
          cy.get('#title-input').type('Second blog created by cypress')
          cy.get('#author-input').type('Cypress Author 2')
          cy.get('#url-input').type('notrealadress.com')
          cy.get('#submit-blog-button').click()

          cy.contains('create new blog').click()
          cy.get('#title-input').type('Third blog created by cypress')
          cy.get('#author-input').type('Cypress Author 3')
          cy.get('#url-input').type('notrealadress.com')
          cy.get('#submit-blog-button').click()
        })
        it('Blogs are arranged based on amount of likes', function () {
          // Initial order should be order in which they are made
          cy.get('.blog').eq(0).should('contain', 'A blog created by cypress')
          cy.get('.blog').eq(1).should('contain', 'Second blog created by cypress')
          cy.get('.blog').eq(2).should('contain', 'Third blog created by cypress')
          // Third blog liked => So it should be on top
          cy.get('.blog')
            .contains('Third blog created by cypress')
            .contains('view').click()

          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()

          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .contains('likes 1', { timeout: 6000 } )

          cy.get('.blog').eq(0).should('contain', 'Third blog created by cypress')
          cy.get('.blog').eq(1).should('contain', 'A blog created by cypress')
          cy.get('.blog').eq(2).should('contain', 'Second blog created by cypress')

          // First blog liked twice => It should move on top
          cy.get('.blog')
            .contains('A blog created by cypress')
            .contains('view').click()

          cy.get('.blog')
            .contains('A blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()

          cy.get('.blog')
            .contains('A blog created by cypress')
            .parent()
            .contains('likes 1', { timeout: 6000 } )

          cy.get('.blog')
            .contains('A blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('A blog created by cypress')
            .parent()
            .contains('likes 2', { timeout: 6000 } )

          cy.get('.blog').eq(0).should('contain', 'A blog created by cypress')
          cy.get('.blog').eq(1).should('contain', 'Third blog created by cypress')
          cy.get('.blog').eq(2).should('contain', 'Second blog created by cypress')

          // Second blog liked four times & Third blog liked two more times.
          // Order should be second, third, A blog
          cy.get('.blog')
            .contains('Second blog created by cypress')
            .contains('view').click()

          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .contains('likes 1', { timeout: 6000 } )

          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .contains('likes 2', { timeout: 6000 } )

          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .contains('likes 3', { timeout: 6000 } )

          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Second blog created by cypress')
            .parent()
            .contains('likes 4', { timeout: 6000 } )

          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .contains('likes 2', { timeout: 6000 } )

          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .find('button')
            .contains('like')
            .click()
          cy.get('.blog')
            .contains('Third blog created by cypress')
            .parent()
            .contains('likes 3', { timeout: 6000 } )

          cy.get('.blog').eq(0).should('contain', 'Second blog created by cypress')
          cy.get('.blog').eq(1).should('contain', 'Third blog created by cypress')
          cy.get('.blog').eq(2).should('contain', 'A blog created by cypress')
        })
      })
    })
  })

})