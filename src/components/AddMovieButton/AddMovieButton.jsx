import React from 'react';
import PropTypes from 'prop-types';
import { MovieType } from '../Types/MovieType';

export const AddMovieButton = ({
  movie,
  movies,
  setMovies,
  setTitle,
  setMovie,
  setHelp,
}) => (
  <button
    type="button"
    className="button is-primary"
    onClick={() => {
      if (movie && movies.every(film => film.imdbId !== movie.imdbId)) {
        setMovies([...movies, movie]);
        setTitle('');
        setMovie(null);
      }

      if (movie && !movies.every(film => film.imdbId !== movie.imdbId)) {
        setHelp('This movie is already on the list');
      }

      if (!movie) {
        setHelp('Please find the movie');
      }

      setTitle('');
      setMovie(null);
    }}
  >
    Add to the list
  </button>
);

AddMovieButton.propTypes = {
  movie: PropTypes.shape(MovieType),
  movies: PropTypes.arrayOf(PropTypes.shape(MovieType)).isRequired,
  setMovies: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  setMovie: PropTypes.func.isRequired,
  setHelp: PropTypes.func.isRequired,
};

AddMovieButton.defaultProps = {
  movie: null,
};
