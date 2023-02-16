import React, { FormEvent, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ResponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loadError, setLoadError] = useState<ResponseError | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const loadMovie = async (
    currentQuery: string,
    event:FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsDataLoading(true);

    try {
      const data = await getMovie(currentQuery);

      if ('Error' in data) {
        setLoadError(data);
        setIsDataLoading(false);
      } else {
        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
        setIsDataLoading(false);
      }
    } catch {
      setLoadError({
        Response: 'False',
        Error: 'unexpected error',
      });
      setIsDataLoading(false);
    } finally {
      setIsDataLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => loadMovie(query.toLowerCase(), event)}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLoadError(null);
              }}
            />
          </div>

          {loadError && (
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
              className={cn('button is-light', {
                'is-loading': isDataLoading,
              })}
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
                onClick={() => {
                  addMovies(movie);
                  setMovie(null);
                  setQuery('');
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
