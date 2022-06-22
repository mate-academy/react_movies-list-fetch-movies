import React, { useState } from 'react';
// import classNames from 'classnames';

import './FindMovie.scss';

import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

import { Form } from '../Form';

interface Props {
  onAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, stateMovie] = useState<Movie | null>(null);
  const [title, setTitile] = useState(''); // move to form
  const [isMovieFound, setIsMovieFound] = useState(false);

  const clearFields = () => {
    setTitile('');
    stateMovie(null);
  };

  const findMovieHandler = () => {
    getMovie(title)
      .then(response => stateMovie(response))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        setIsMovieFound(true);
        clearFields();
      });
  };

  const onSubmit = () => {
    if (movie !== null) {
      onAddMovie(movie);
      clearFields();
      setIsMovieFound(false);
    }
  };

  return (
    <>
      <Form
        title={title}
        setTitle={setTitile}
        setIsMovieFound={setIsMovieFound}
        isMovieFound={isMovieFound}
        findMovieHandler={findMovieHandler}
        onSubmit={onSubmit}
        movie={movie}
      />

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}

    </>
  );
};
