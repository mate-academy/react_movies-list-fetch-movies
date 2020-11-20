import PropTypes from 'prop-types';

export const MovieCardPropTypesShape = PropTypes.shape({
  Title: PropTypes.string.isRequired,
  Plot: PropTypes.string.isRequired,
  Poster: PropTypes.string.isRequired,
  imdbID: PropTypes.string.isRequired,
}).isRequired;
