import React from 'react';

import './MoviesList.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { movieShape } from '../../shapes/movieShape';

export const MoviesList = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard
        key={movie.imdbID}
        title={movie.Title}
        description={movie.Plot}
        imgUrl={movie.Poster}
        imdbUrl={`https://www.imdb.com/title/${movie.imdbID}`}
      />
    ))}
  </div>
);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(movieShape).isRequired,
};
