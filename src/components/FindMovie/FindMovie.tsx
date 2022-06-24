import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Form } from '../Form/Form';

interface Props {
  onAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, stateMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState(''); // move to form
  const [isMovieFound, setIsMovieFound] = useState(false);

  const clearFields = () => {
    setTitle('');
    stateMovie(null);
  };

  const findMovieCatch = () => {
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
        setTitle={setTitle}
        setIsMovieFound={setIsMovieFound}
        isMovieFound={isMovieFound}
        findMovieCatch={findMovieCatch}
        onSubmit={onSubmit}
        movie={movie}
      />

      {movie && (
        <div className="container">
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
