import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  previewMovie?: MovieData | null;
};

export const MoviesList: React.FC<Props> = ({ movies, previewMovie }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId} movie={movie} />
    ))}

    {previewMovie && (
      <MovieCard
        key={previewMovie.imdbID}
        movie={previewMovie}
      />
    )}
  </div>
);
