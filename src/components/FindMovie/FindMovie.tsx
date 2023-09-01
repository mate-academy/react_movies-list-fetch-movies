import React, {
  useState,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import {
  getMovie,
} from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState({} as Movie);
  const [loaderState, setLoaderState] = useState(false);
  const [isFound, setIsFound] = useState(true);

  function handleInput(e: string) {
    setQuery(e);
  }

  function handleMovieAddButton(e: React.MouseEvent) {
    e.preventDefault();
    onAdd(newMovie);
    setNewMovie({} as Movie);
    setQuery('');
  }

  function handleSearch(e: React.MouseEvent) {
    e.preventDefault();
    setLoaderState(true);
    getMovie(query)
      .then((res) => {
        if ('Error' in res) {
          return setIsFound(false);
        }

        return (
          setNewMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster,
            imdbUrl: '',
            imdbId: res.imdbID,
          }),
          setIsFound(true)
        );
      })
      .finally(() => setLoaderState(false));
  }

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
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !isFound,
              })}
              onChange={(e) => handleInput(e.target.value)}
            />
          </div>

          {!isFound && (
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
                'button is-loading': loaderState,
              })}
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="submit"
              className="button is-primary"
              onClick={handleMovieAddButton}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie.imdbId && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
