import PropTypes from 'prop-types';

export const FindMovieTypes = {
  moviesList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      imgUrl: PropTypes.string,
      imdbUrl: PropTypes.string,
      imdbId: PropTypes.string,
    }),
  ).isRequired,
  onSetMoviesList: PropTypes.func.isRequired,
};
