import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = React.memo(({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<string | null>(null);

  const handleGetMovie = async (event: FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setQuery('');
      setIsError('Please type movie name');

      return;
    }

    setIsLoading(true);

    await getMovie(query.trim())
      .then(response => {
        if ('Error' in response) {
          setIsError("Can't find a movie with such a title");

          return;
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })
      .finally(() => {
        setQuery('');
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setQuery('');
    }
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setIsError(null);
                setQuery(event.target.value);
              }}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {isError}
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
              onClick={handleGetMovie}
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
});
