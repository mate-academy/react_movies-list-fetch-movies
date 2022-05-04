import React from 'react';
import { FindMovie } from '../FindMovie';

type Props = {
  addMovie: (movie: Movie) => void,
  deleteMovie: (movie: Movie) => void,
};

export const Search: React.FC<Props> = ({ addMovie, deleteMovie }) => {
  return (
    <div className="ml-6 mr-6 columns">
      <div className="column">
        <FindMovie addMovie={addMovie} deleteMovie={deleteMovie} />
      </div>
    </div>
  );
};
