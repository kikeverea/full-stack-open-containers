const apiUrl = 'http://localhost:3000/api'
const RESET_URL = `${ apiUrl }/testing/reset`
const USERS_URL = `${ apiUrl }/users`
const LOGIN_URL = `${ apiUrl }/login`
const BLOGS_URL = `${ apiUrl }/blogs`

const login = (username, password, expectedStatus) => {
  cy.get('#User').type(username)
  cy.get('#Password').type(password)

  submitForm('http://localhost:3000/api/login', '#submitButton', expectedStatus)
}

const addDummyBlog = (times=1) => {
  const blogs = []

  for (let i = 0; i < times; i++) {
    const dummy = {
      title: `A dummy blog ${ i }`,
      author: `Me ${ i }`,
      url: `www.mine${ i }.com`
    }
    blogs.push(dummy)
    addBlog(dummy)
  }

  return times === 1 ? blogs[0] : blogs
}

const addBlog = (blog) => {
  openNewBlogForm()

  // write to form
  cy.get('#Title').type(blog.title)
  cy.get('#Author').type(blog.author)
  cy.get('#Url').type(blog.url)

  submitForm(BLOGS_URL, '#new-blog-submit', 201)
}

const containsNotification = (text, color) => {
  cy.get('#notification')
    .should('contain', text)
    .and('have.css', 'color')
    .and('eq', color)
}

const submitForm = (url, submitButtonSelector, expectedStatus) => {
  cy.intercept('POST', url).as('request')
  cy.get(submitButtonSelector).click()
  cy.wait('@request').its('response.statusCode').should('eq', expectedStatus)
}

const openNewBlogForm = () =>
  cy.get('.toggable>.toggler-element>.toggle-button').click()

const expandAllBlogs = (blogsCount) => {
  for (let i = 0; i < blogsCount; i++) {
    cy.get('.blog').eq(i).contains('button', 'view').click()
  }
}

export default {
  RESET_URL, USERS_URL, BLOGS_URL, LOGIN_URL,
  login, addDummyBlog, containsNotification, submitForm, openNewBlogForm, expandAllBlogs }