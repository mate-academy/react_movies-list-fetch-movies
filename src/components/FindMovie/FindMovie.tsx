import React, { useState } from 'react';
import classNames from 'classnames';
import { request } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [inputText, setInputText] = useState('');
  const [previeData, setPrevieData] = useState<Movie | null>(null);
  const [errorMasage, setErrorMasage] = useState(false);

  const selectFilm = async () => {
    if (!inputText) {
      return;
    }

    const film = await request(inputText);

    if (film.Response === 'False') {
      setErrorMasage(true);

      return;
    }

    if (previeData?.imdbID === film.imdbID) {
      return;
    }

    setInputText('');
    setPrevieData({
      Poster: film.Poster,
      Title: film.Title,
      Plot: film.Plot,
      imdbID: film.imdbID,
    });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={inputText}
              onChange={(event) => {
                setErrorMasage(false);
                setInputText(event.target.value);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMasage })}
            />
          </div>

          {errorMasage && (
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
              onClick={() => {
                selectFilm();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={errorMasage}
              onClick={() => {
                if (previeData) {
                  addMovie(previeData);
                  setPrevieData(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previeData && <MovieCard movie={previeData} />}
      </div>
    </>
  );
};
