import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> creates new blog', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm handleSubmit={createBlog} />)

  const titleInput = container.querySelector('#title')
  const urlInput = container.querySelector('#url')
  const authorInput = container.querySelector('#author')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'some title')
  await user.type(urlInput, 'some url')
  await user.type(authorInput, 'someone')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({author:'someone', title: 'some title', url: 'some url'})
})