import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAdd(movie: Movie): void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [movieError, setMovieError] = useState(false);

  const addMovie = () => {
    if (!movie) {
      return;
    }

    onAdd(movie);
    setMovie(null);
    setQuery('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsSearching(true);

    getMovie(query)
      .then(res => {
        if ('Error' in res) {
          setMovieError(true);

          return;
        }

        setMovie({
          imdbId: res.imdbID,
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : res.Poster,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}/`,
        });
      })
      .finally(() => setIsSearching(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              className="input is-dander"
              placeholder="Enter a title to search"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {movieError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isSearching },
              )}
              disabled={!query}
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
                disabled={!movie}
                onClick={addMovie}
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
