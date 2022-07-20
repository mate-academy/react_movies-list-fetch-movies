import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
}

export const MoviesList: React.FC<Props> = (props) => {
  const { movies } = props;

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
};
