import React, { useContext } from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { StateConstext } from '../../State/State';

type Props = {
  movies: Movie[];
};

export const MoviesList: React.FC<Props> = ({ movies }) => {
  const { moviesList } = useContext(StateConstext);

  localStorage.setItem('movies', JSON.stringify(moviesList));

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
