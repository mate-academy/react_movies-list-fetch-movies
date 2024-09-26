import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movies: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<null | Movie>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const readyQuery = query.trim();
  const DEFAULT_IMG
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleSearch = (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(readyQuery)
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response;

          setNewMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          });
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (newMovie) {
      addMovie(newMovie);
    }

    setHasError(false);
    setNewMovie(null);
    setQuery('');
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {hasError && (
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
              className={classNames({
                'button is-light': !isLoading,
                'button is-loading': isLoading,
              })}
              disabled={!readyQuery}
              onClick={handleSearch}
            >
              {!newMovie ? (
                'Find a movie'
              ) : (
                'Search again'
              )}
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
