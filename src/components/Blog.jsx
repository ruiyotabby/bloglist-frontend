import PropTypes from 'prop-types';

const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>
);


Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
  }),
};

export default Blog;
