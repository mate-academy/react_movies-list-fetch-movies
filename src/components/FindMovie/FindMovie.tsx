import './FindMovie.scss';
import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard/MovieCard';

// import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);

  const filmNotFound = () => {
    setShowError(false);
    setMovieInfo(null);
  };

  const request = (filmTitle: string) => {
    return fetch(`https://www.omdbapi.com/?apikey=edc77aa9&t=${filmTitle}`).then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json().then(movie => {
        return movie.Response === 'False' ? filmNotFound() : setMovieInfo(movie);
      });
    });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className="input is-danger"
                onChange={(event) => {
                  setTitle(event.currentTarget.value);
                  setShowError(true);
                }}
              />
            </div>
          </label>
          <p className={classNames('help is-danger', { 'error-hidden': showError })}>
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                request(title);
              }}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                setTitle('');

                return movieInfo ? addMovie(movieInfo) : null;
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {movieInfo ? <MovieCard movie={movieInfo} /> : null}
      </div>
    </>
  );
};
