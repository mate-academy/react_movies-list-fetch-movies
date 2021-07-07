import PropTypes from 'prop-types';

export const movieShape = PropTypes.shape({
  Title: PropTypes.string,
  Poster: PropTypes.string,
  imdbID: PropTypes.string,
  Plot: PropTypes.string,
});
