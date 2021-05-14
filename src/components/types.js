import PropTypes from 'prop-types';

export const MovieCardType = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string.isRequired,
};

export const MovieType = {
  title: PropTypes.string,
  description: PropTypes.string,
  imgUrl: PropTypes.string,
  imdbUrl: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
};

MovieType.defaultProps = {
  title: '',
  description: '',
  imgUrl: '',
};
