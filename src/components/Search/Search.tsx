import React from 'react';
import { FindMovie } from '../FindMovie';
import { MoviesList } from '../MoviesList';

type Props = {
  addMovie: (movie: Movie) => void,
  deleteMovie: (movie: Movie) => void,
  movies: Movie[],
};

export const Search: React.FC<Props> = ({ addMovie, deleteMovie, movies }) => {
  return (
    <div className="ml-6 mr-6 columns">
      <div className="column is-four-fifths">
        <MoviesList movies={movies} deleteMovie={deleteMovie} />
      </div>
      <div className="column">
        <FindMovie addMovie={addMovie} deleteMovie={deleteMovie} />
      </div>
    </div>
  );
};
