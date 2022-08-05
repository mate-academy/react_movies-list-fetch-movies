import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  list: MovieData[];
};

export const MoviesList: React.FC<Props> = ({ list }) => (
  <div className="movies">
    {list.map(movie => (
      <MovieCard
        key={movie.imdbID}
        film={movie}
      />
    ))}
  </div>
);
