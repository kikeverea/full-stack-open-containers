import helper from './cypressHelper'

beforeEach(function () {
  cy.request('POST', 'http://localhost:3000/api/testing/reset')
    .then(() =>
      cy.request('POST', 'http://localhost:3000/api/users', {
        name: 'kike',
        username: 'kike',
        password: 'asd' }))

  cy.visit('http://localhost:3000')
})

describe('Login test', function () {

  it('Login form shown by default', function () {
    cy.contains('User')
    cy.contains('Password')
    cy.contains('login')
  })

  it('succeed with correct credentials', function () {
    helper.login('kike', 'asd', 200)
    helper.containsNotification('Logged in', 'rgb(0, 128, 0)')
    cy.contains('kike')
  })

  it('fails with wrong credentials', function () {
    helper.login('incorrect_user', 'incorrect_password', 401)
    helper.containsNotification('Login failed. Wrong credentials', 'rgb(255, 0, 0)')

    //screen unchanged
    cy.contains('User')
    cy.contains('Password')
  })
})