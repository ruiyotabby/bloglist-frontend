import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

describe('<Blog />', () => {
  test('renders only title and author by default', () => {
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

    const {container} = render(<Blog blog={blog} />)

    const hiddenContent = container.querySelector('.hiddenContent')
    expect(hiddenContent).toHaveStyle('display: none')

    const visibleContent = screen.getByText('Some title Someone')
    expect(visibleContent).toBeDefined()
    expect(visibleContent).not.toHaveStyle('display: none')
  })

})