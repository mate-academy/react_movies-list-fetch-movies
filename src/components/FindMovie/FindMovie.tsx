import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  setMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props>
= ({ setMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorTitle, setErrorTitle] = useState(false);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClickFindMovie
  = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);

    if (query) {
      getMovie(query)
        .then(res => {
          if ('Error' in res) {
            setFoundMovie(null);
            setErrorTitle(true);
          } else {
            const newMovie = {
              title: res.Title,
              description: res.Plot,
              imgUrl: res.Poster,
              imdbId: res.imdbID,
              imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            };

            setFoundMovie(newMovie);
            setErrorTitle(false);
          }
        });
    }

    setIsLoading(false);
  };

  const handleClickAddMovie = (movie: Movie) => {
    setMovie(previous => {
      const newMovie = {
        ...movie,
      };

      return [...previous, newMovie];
    });

    setQuery('');
    setFoundMovie(null);
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
              value={query}
              onChange={handleChangeTitle}
            />
          </div>

          {errorTitle
          && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleClickFindMovie}
              disabled={!query}
            >
              {foundMovie && query && !errorTitle ? (
                <p>Search again</p>
              ) : (
                <p>Find a movie</p>
              )}
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleClickAddMovie(foundMovie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {foundMovie
          && (
            <div className="container" data-cy="previewContainer">
              <h2 className="title">Preview</h2>
              <MovieCard movie={foundMovie} />
            </div>
          )}
    </>
  );
};
