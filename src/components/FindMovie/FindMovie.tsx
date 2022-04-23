import React, { useState, useCallback } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (arg0: Movie)=> void;
  moviesAlredyExist: boolean;
  setMoviesAlredyExist: (arg0: boolean) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie, moviesAlredyExist, setMoviesAlredyExist } = props;
  const [movieTitle, setMovieTitle] = useState('');
  const [serverData, setServerData] = useState<Movie | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  const titleHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMovieTitle(event.target.value);
      setErrorMessage('');
    }, [movieTitle],
  );

  const addMovieHandler = useCallback(
    () => {
      if (serverData !== undefined) {
        addMovie(serverData);
        setServerData(undefined);
        setMovieTitle('');
      }
    }, [serverData],
  );

  const searchHandler = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      getMovie(movieTitle)
        .then((res) => {
          if (res.Response === 'False') {
            setErrorMessage("Can't find a movie with such a title");

            return;
          }

          setMoviesAlredyExist(false);
          setServerData(res);
        });
    }, [movieTitle],
  );

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={errorMessage ? 'input is-danger' : 'input'}
              value={movieTitle}
              onChange={titleHandler}
            />
          </div>
          <p className="help is-danger">
            {errorMessage}
          </p>

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {moviesAlredyExist
          ? <span className="movie">Movie is alredy in the list</span>
          : serverData !== undefined && <MovieCard movie={serverData} /> }
      </div>
    </>
  );
};
