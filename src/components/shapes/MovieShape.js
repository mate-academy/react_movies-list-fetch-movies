import PropTypes from 'prop-types';

export const MovieShape = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
};
