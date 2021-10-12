import React, { useCallback, useRef, useState } from 'react';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { ErrorMessages } from '../../api/Errors';

type Props = {
  addMovie: (movie: Movie) => boolean;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState(ErrorMessages.EMPTY);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const errorClass = 'is-danger';

  const removeClassIsDanger = () => {
    const inputClasses = inputRef.current?.classList;

    if (inputClasses?.contains(errorClass)) {
      inputClasses?.remove(errorClass);
    }
  };

  const addClassIsDanger = () => {
    const inputClasses = inputRef.current?.classList;

    if (!inputClasses?.contains(errorClass)) {
      inputClasses?.add(errorClass);
    }
  };

  const findMovie = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      addClassIsDanger();

      return;
    }

    try {
      const movie = await getMovie(title);

      setFoundMovie(movie);
    } catch (err) {
      if (errorMsg !== ErrorMessages.NOT_FOUND) {
        const { message } = err as Error;

        addClassIsDanger();
        setErrorMsg(message as ErrorMessages);
        setFoundMovie(null);
      }
    }
  }, [title]);

  const HandleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) {
      setErrorMsg(ErrorMessages.EMPTY);
    }

    removeClassIsDanger();
    setTitle(e.target.value);
  };

  const handleMovieAdd = () => {
    if (!foundMovie) {
      return;
    }

    const added: boolean = addMovie(foundMovie);

    if (!added) {
      setErrorMsg(ErrorMessages.ALREADY_EXISTS);
    }

    setFoundMovie(null);
    setTitle(ErrorMessages.EMPTY);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              ref={inputRef}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={title}
              onChange={HandleInput}
            />
          </div>

          <p className="help is-danger">
            {errorMsg}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleMovieAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && <MovieCard movie={foundMovie} />}
      </div>
    </>
  );
};
