import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const imdbBaseUrl = 'https://www.imdb.com/title/';

  const movieToAdd = {
    title: movie?.Title,
    description: movie?.Plot,
    imgUrl: movie?.Poster,
    imdbUrl: imdbBaseUrl + movie?.imdbID,
    imdbId: movie?.imdbID,
  };

  const handleMovieSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCount(prev => prev + 1);

    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if (Object.hasOwn(response, 'Error')) {
          setIsError(true);
        } else {
          setMovie(response as MovieData);
        }
      })
      // eslint-disable-next-line no-console
      .catch(error => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = () => {
    setCount(0);
    setMovie(null);
    setQuery('');

    onAddMovie(movieToAdd as Movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleMovieSearch}
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
              placeholder="Enter a title to search"
              className={cn(
                'input',
                { 'is-danger': isError },
              )}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              {count === 0
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
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
          <MovieCard
            movie={movieToAdd as Movie}
          />
        </div>
      )}
    </>
  );
};
