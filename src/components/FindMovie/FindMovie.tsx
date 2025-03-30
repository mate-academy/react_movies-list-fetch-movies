import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddNewMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddNewMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = () => {
    getMovie(query.trim())
      .then(moviesFromServer => {
        if ('Error' in moviesFromServer) {
          setHasError('Can&apos;t find a movie with such a title');

          return;
        }

        setMovie({
          title: moviesFromServer.Title,
          description: moviesFromServer.Plot,
          imdbUrl: `https://www.imdb.com/title/${moviesFromServer.imdbID}`,
          imdbId: moviesFromServer.imdbID,
          imgUrl:
            moviesFromServer.Poster !== 'N/A'
              ? moviesFromServer.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        });
      })
      .catch(() => setHasError('Try again'))
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    findMovie();
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setHasError('');
              }}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {hasError}
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
              disabled={!query.trim()}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddNewMovie(movie);
                  setQuery('');
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
