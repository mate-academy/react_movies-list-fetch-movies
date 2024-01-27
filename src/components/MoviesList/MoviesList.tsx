import React from 'react';

import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

import './MoviesList.scss';
import { Movie } from '../../types/Movie';

type Props = {
  movies: MovieData[] | Movie[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => {
  return (
    <div className="movies">
      {movies.map((movie: Movie | MovieData) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
};
