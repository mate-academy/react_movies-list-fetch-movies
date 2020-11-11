import React from 'react';

import './MoviesList.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

export const MoviesList = ({
  movies = [],
}) => (

  <div className="movies">
    {movies.length === 0
      ? <p>Please add your favorite movies</p>
      : (movies.map(movie => (
        <MovieCard key={movie.imdbID} {...movie} />
      )))
    }
    {/* {movies.map(movie => (
      <MovieCard key={movie.imdbID} {...movie} />
    ))} */}
  </div>
);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
