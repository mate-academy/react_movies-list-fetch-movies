import React from 'react';
import './MoviesList.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

export const MoviesList = ({
  movies = [],
}) => (

  <ul className="movies-list">
    {
      movies.map(movie => (
        <li className="wrapper" key={movie.imdbId}>
          <MovieCard {...movie} />
        </li>
      ))
    }
  </ul>
);

MoviesList.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
