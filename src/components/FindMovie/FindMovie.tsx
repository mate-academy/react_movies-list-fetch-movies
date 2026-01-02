import React from 'react';
import cl from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { transformMovieData } from '../../services/transformMovieData';

type Props = {
  inputValue: string;
  findedMovie: Movie | null;
  load: boolean;
  danger: boolean;
  changeInputValue: (query: string) => void;
  changeFindedMovie: (movie: Movie | null) => void;
  addMovie: (movie: Movie) => void;
  changeLoad: (value: boolean) => void;
  toogleDanger: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  inputValue,
  findedMovie,
  load,
  danger,
  changeInputValue,
  changeFindedMovie,
  addMovie,
  toogleDanger,
  changeLoad,
}) => {
  const findMovieHandler = (query: string) => {
    if (query.trim() === '') {
      toogleDanger(true);
      changeLoad(false);

      return;
    }

    toogleDanger(false);
    changeFindedMovie(null);

    getMovie(query)
      .then(data => {
        if ('Title' in data) {
          changeFindedMovie(transformMovieData(data));
          toogleDanger(false);
        } else {
          toogleDanger(true);
        }
      })
      .catch(() => toogleDanger(true))
      .finally(() => changeLoad(false));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    changeLoad(true);
    findMovieHandler(inputValue.trim());
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cl('input', {
                'is-danger': danger,
              })}
              value={inputValue}
              onChange={event => {
                changeInputValue(event.target.value);

                if (danger) {
                  toogleDanger(false);
                }
              }}
            />
          </div>

          {danger && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cl('button is-light', { 'is-loading': load })}
              disabled={inputValue.trim() === '' ? true : false}
            >
              {findedMovie !== null ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(findedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
