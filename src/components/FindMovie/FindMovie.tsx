import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const searchRow = query.trim().split(' ').join('+');

    setIsLoading(true);
    getMovie(searchRow)
      .then(data => {
        if ('Error' in data) {
          setIsError(true);
          setError(data.Error);
        } else {
          const poster =
            !data.Poster || data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster;

          const selectedInfo: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: poster,
            imdbUrl: 'https://www.imdb.com/title/' + data.imdbID,
            imdbId: data.imdbID,
          };

          setMovie(selectedInfo);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    setQuery('');
    onAdd(movie as Movie);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSearch(event)}>
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
              className={classNames('input', { 'is-danger': isError })}
              value={query}
              onChange={event => handleQueryChange(event)}
            />
          </div>
          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
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
              disabled={!query && true}
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
                onClick={handleAddMovie}
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
