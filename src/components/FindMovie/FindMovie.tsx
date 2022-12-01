import React, { useState } from 'react';
import './FindMovie.scss';
// import { useState } from 'react';
import classNames from 'classnames';
// import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

// type Props = {
//   addMovie: (movie: Movie) => void;
// };

export const FindMovie: React.FC
= () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie[]>([]);
  const [errorTitle, setErrorTitle] = useState(false);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClickFindMovie = async () => {
    setIsLoading(true);
    // const inputToLowercase = query.toLocaleLowerCase();

    const film = await getMovie(query);

    if (film) {
      const newMovie = {
        title: film.Title,
        description: film.Plot,
        imgUrl:
        imdbUrl:
        imdbId: film.imdbID,
      }

      setFoundMovie(newMovie);
    }

    if (!film) {
      setErrorTitle(true);
    }

    setIsLoading(false);
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
            {!query
              ? (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className="button is-light"
                  disabled
                >
                  Find a movie
                </button>
              ) : (
                <button
                  data-cy="searchButton"
                  type="submit"
                  className={classNames('button is-light', {
                    'is-loading': isLoading,
                  })}
                  onClick={handleClickFindMovie}
                >
                  Find a movie
                </button>
              )}

          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        <MovieCard movie={foundMovie} />
      </div>
    </>
  );
};
