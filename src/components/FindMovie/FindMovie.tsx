import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  onSetMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onSetMovie }) => {
  const [isMovieFound, setIsMovieFound] = useState(false);
  const [titleQuery, setTitleQuery] = useState('');
  const [movieFromServer, setMovieFromServer] = useState<Movie>();

  const onTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setTitleQuery(event.target.value);
  };

  const onGetMovie = () => {
    if (titleQuery) {
      getMovie(titleQuery.toLowerCase().trim())
        .then(movie => {
          if (movie.Response === 'True') {
            setMovieFromServer(movie);
            setIsMovieFound(true);
          } else {
            setIsMovieFound(false);
          }
        });
    }
  };

  const onSubmitMovie = () => {
    if (movieFromServer && movieFromServer.Response === 'True') {
      onSetMovie(movieFromServer);
      setTitleQuery('');
    } else {
      setIsMovieFound(true);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={`input ${(!isMovieFound && movieFromServer) ? 'is-danger' : null}`}
                value={titleQuery}
                onChange={onTitleChange}
              />
            </div>
          </label>

          {!isMovieFound
          && movieFromServer
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onGetMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onSubmitMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFromServer && isMovieFound && <MovieCard movie={movieFromServer} />}
      </div>
    </>
  );
};
