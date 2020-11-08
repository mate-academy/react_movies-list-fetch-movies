import PropTypes from 'prop-types';

export const MovieShape = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string.isRequired,
};
