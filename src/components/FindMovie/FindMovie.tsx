import React, { FormEventHandler, useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';
import { Movie } from '../../types/Movie';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const defaultPosterUrl =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const isTitleLiquid = query.trim().length > 0;

  useEffect(() => {
    setError(null);
  }, [query]);

  const handleFindMovie: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (isTitleLiquid) {
      setIsLoading(true);
      getMovie(query)
        .then(data => {
          if ('Error' in data) {
            setError(data);
            setMovie(null);
          } else {
            const newMovie = {
              title: data.Title,
              description: data.Plot,
              imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultPosterUrl,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
              imdbId: data.imdbID,
            };

            setMovie(newMovie);
            setError(null);
          }
        })
        .catch(_ => {
          setError(_);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {error && (
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
                'is-loading': isLoading,
              })}
              disabled={!isTitleLiquid}
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
