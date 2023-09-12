import React from 'react';
import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Blog from "./Blog";

describe('<Blog />', () => {
  const blog = {
    title: 'Some title',
    author: 'Someone',
    likes: 0,
    url: 'www.localhost.com',
    user: {
      id: '123456789',
      name: 'some name'
    }
  }

  test('renders only title and author by default', () => {
    const {container} = render(<Blog blog={blog} />)
    screen.debug()

    const hiddenContent = container.querySelector('.hiddenContent')
    expect(hiddenContent).toHaveStyle('display: none')

    const visibleContent = screen.getByText('Some title Someone')
    expect(visibleContent).toBeDefined()
    expect(visibleContent).not.toHaveStyle('display: none')
  })

  test('renders the rest of the details on button press', async () => {
    const {container} = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const hiddenContent = container.querySelector('.hiddenContent')
    expect(hiddenContent).not.toHaveStyle('display: none')
  })

  test('clicking like button twice calls event handler twice', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} handleClick={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('like')

    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)

  })

})