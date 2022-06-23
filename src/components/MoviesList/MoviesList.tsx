import React from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  selectedMovie: Movie[] | null;
}

export const MoviesList: React.FC<Props> = ({ selectedMovie }) => {
  return (
    <div className="movies">
      {selectedMovie?.map(movie => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
        />
      ))}
    </div>
  );
};
