/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

const API_KEY = 'd27c6dc9';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [hasLoadingError, isError] = useState(false);
  const [film, setFilm] = useState(null);

  const findMovie = () => {
    setFilm(null);

    try {
      fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`)
        .then(response => response.json())
        .then(findedFilm => {
          if (findedFilm.Response === 'False') {
            isError(true);

            return;
          }

          setFilm(findedFilm);
        });
    } catch (error) {
      isError(true);
    }
  };

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    isError(false);

    if (!value.trim()) {
      isError(true);
    }

    setTitle(value);
  };

  const clearForm = () => {
    setTitle('');
    isError(false);
    setFilm(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={changeTitle}
              value={title}
            />
          </div>

          {hasLoadingError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!title.trim().length}
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={!film}
              type="button"
              className="button is-primary"
              onClick={() => {
                if (film) {
                  onAdd(film);
                  clearForm();
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
        {film && (
          <MovieCard movie={film} />
        )}
      </div>
    </>
  );
};
