import PropTypes from 'prop-types';

export const movieShape = PropTypes.arrayOf(PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string.isRequired,
}).isRequired);
