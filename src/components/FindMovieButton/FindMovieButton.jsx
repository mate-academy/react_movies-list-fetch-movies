import React from 'react';
import PropTypes from 'prop-types';
import { getTitle } from '../../api/helper';

export const FindMovieButton = ({
  title,
  setMovie,
  setHelp,
}) => (
  <button
    type="button"
    className="button is-light"
    onClick={() => (
      getTitle(title)
        .then((movie) => {
          if (movie.Response === 'False') {
            setHelp('Can\'t find a movie with such a title');
            setMovie(null);
          } else {
            setMovie({
              title: movie.Title,
              description: movie.Plot,
              imgUrl: movie.Poster,
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              imdbId: movie.imdbID,
            });
            setHelp('');
          }
        })
    )}
  >
    Find a movie
  </button>
);

FindMovieButton.propTypes = {
  title: PropTypes.string.isRequired,
  setMovie: PropTypes.func.isRequired,
  setHelp: PropTypes.func.isRequired,
};
