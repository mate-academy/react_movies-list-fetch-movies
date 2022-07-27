import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../type/Movie';

type Props = {
  movies: Movie[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => {
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
