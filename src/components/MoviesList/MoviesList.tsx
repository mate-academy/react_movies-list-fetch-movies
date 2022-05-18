import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
}

export const MoviesList: React.FC<Props> = (props) => {
  const { movies } = props;

  return (
    <ul className="movies">
      {movies.map(movie => (
        <li key={movie.imdbID}>
          <MovieCard
            key={movie.imdbID}
            movie={movie}
          />
        </li>
      ))}
    </ul>
  );
};
