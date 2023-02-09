import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  onAdd: (finded: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [inputTitle, setInputTitle] = useState<string>('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [isMovieFinded, setIsMovieFinded] = useState<boolean>(true);

  let findButtonClasses = classNames(
    'button is-light',
    { 'is-loading': false },
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTitle(event.target.value);

    setIsMovieFinded(true);
  };

  const findMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    findButtonClasses = classNames(
      'button is-light',
      { 'is-loading': true },
    );

    getMovie(inputTitle)
      .then(result => {
        if ('Error' in result) {
          setFindedMovie(null);
          setIsMovieFinded(false);
        } else {
          setFindedMovie({
            title: result.Title,
            description: result.Plot,
            imgUrl: result.Poster,
            imdbUrl: `www.imdb.com/title/${result.imdbID}/`,
            imdbId: result.imdbID,
          });
        }
      })
      .finally(() => {
        findButtonClasses = classNames(
          'button is-light',
          { 'is-loading': false },
        );
      });
  };

  const addMovie = () => {
    if (findedMovie) {
      onAdd(findedMovie);
    }

    setFindedMovie(null);
    setInputTitle('');
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={inputTitle}
              onChange={onInputChange}
            />
          </div>

          {isMovieFinded || (
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
              className={findButtonClasses}
              onClick={findMovie}
              disabled={!inputTitle.length}
            >
              Find a movie
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!findedMovie || (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
