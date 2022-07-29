import React, { useEffect, useState } from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  dublicate: boolean,
};

export const MoviesList: React.FC<Props> = ({ movies, dublicate }) => {
  const [show, setShow] = useState(true);

  useEffect(() => setShow(true), [movies]);

  return (
    <div className="movies">
      {dublicate && show && (
        <div className="notification">
          <button
            className="delete"
            type="button"
            onClick={() => setShow(false)}
          >
            +
          </button>
          its dublicate
        </div>
      )}
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
