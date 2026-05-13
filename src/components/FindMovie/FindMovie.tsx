import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [lastSearchDate, setLastSearchDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if (data.Response === 'False') {
          setMovie(null);
          setHasError(true);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbUrl: 'https://www.imdb.com/title/' + data.imdbID,

          imdbId: data.imdbID,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lastSearchDate]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          setLastSearchDate(new Date());
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={e => {
                setHasError(false);
                setQuery(e.target.value);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
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
              disabled={!query.length}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', isLoading && 'is-loading')}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                onClick={() => {
                  onAddMovie(movie);
                  setQuery('');
                  setMovie(null);
                }}
                data-cy="addButton"
                type="button"
                className="button is-primary"
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
