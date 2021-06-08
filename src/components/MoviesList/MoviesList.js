import React from 'react';
import PropTypes from 'prop-types';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard/MovieCard';

export const MoviesList = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map(movie => (
      movie
      && <MovieCard key={movie.imdbId} {...movie} />
    ))}
  </div>
);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
