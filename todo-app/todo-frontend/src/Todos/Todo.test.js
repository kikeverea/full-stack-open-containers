import {render, screen} from "@testing-library/react";
import Todo from "./Todo";


describe(`Renders todo's text correctly`, () => {
  const todo = { text: 'Test text', done: false }

  it ('Renders text', () => {
    render(<Todo todo={ todo }/>)
    expect(screen.getByText(todo.text, {})).toBeDefined()
  })
})


describe('Todo component renders correctly when not done', () => {

  const todo = { text: 'Test text', done: false }

  it ('Renders message when todo is not done', () => {
    render(<Todo todo={ todo }/>)
    expect(screen.getByText('This todo is not done', { exact: true })).toBeDefined()
  })

  it('Renders "Set as done" button when todo is not done', () => {
    render(<Todo todo={ todo }/>)
    expect(screen.getByRole('button', { name: 'Set as done' })).toBeDefined()
  })
})

describe('Todo component renders correctly when done', () => {

  const todo = { text: 'Test text', done: true }

  it ('Renders message when todo is done', () => {
    render(<Todo todo={ todo }/>)
    expect(screen.getByText('This todo is done', { exact: true })).toBeDefined()
  })

  it('Does not render "Set as done" button when todo is done', () => {
    render(<Todo todo={ todo }/>)
    expect(()=> screen.getByRole('button', { name: 'Set as done' })).toThrow()
  })
})