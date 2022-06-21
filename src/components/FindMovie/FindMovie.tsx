import React, { useState } from 'react';
import { Form } from '../Form/Form';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addFilm: (film: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addFilm }) => {
  const [film, setFilm] = useState<Movie | null>(null);

  return (
    <>
      <Form
        setFilm={setFilm}
        addFilm={addFilm}
        film={film}
      />

      {film && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={film} />
        </div>
      )}
    </>
  );
};
