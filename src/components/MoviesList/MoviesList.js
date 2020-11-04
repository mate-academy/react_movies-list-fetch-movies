import React from 'react';
import PropTypes from 'prop-types';
import { MovieShape } from '../shapes/MovieShape';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

export const MoviesList = ({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId} {...movie} />
    ))}
  </div>
);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape(MovieShape).isRequired,
  ).isRequired,
};
