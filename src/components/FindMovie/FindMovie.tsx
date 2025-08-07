import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import classNames from 'classnames';

type Props = {
  onAddMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
    setMovie(null);
  };

  const clearQuery = () => {
    setQuery('');
  };

  const onFindMovie = () => {
    setIsLoading(true);

    getMovie(query)
      .then(moviesFromServer => {
        if (!('Error' in moviesFromServer)) {
          setMovie({
            title: moviesFromServer.Title,
            description: moviesFromServer.Plot,
            imgUrl:
              moviesFromServer.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : moviesFromServer.Poster,
            imdbUrl: `https://www.imdb.com/title/${moviesFromServer.imdbID}`,
            imdbId: moviesFromServer.imdbID,
          });
        } else {
          setErrorMessage("Can't find a movie with such a title");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className={classNames('find-movie', { 'is-loading': isLoading })}
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          onFindMovie();
        }}
      >
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
                'is-danger': errorMessage && query.trim() !== '',
              })}
              onChange={onQueryChange}
            />
          </div>
          {errorMessage && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovies(movie);
                  clearQuery();
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
