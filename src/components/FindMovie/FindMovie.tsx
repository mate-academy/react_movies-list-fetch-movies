import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Prop = {
  onClick: (value: Movie) => void;
};

export const FindMovie: React.FC<Prop> = ({ onClick }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setError] = useState<ResponseError | null>(null);
  const [loader, setLoader] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setError(null);
  };

  const onButtonSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim() !== '') {
      setLoader(true);
      getMovie(query.toLowerCase())
        .then((result => {
          if ('Error' in result) {
            setError(result as ResponseError);
          } else {
            setMovie({
              title: result.Title,
              description: result.Plot,
              imgUrl: result.Poster,
              imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
              imdbId: result.imdbID,
            });
          }
        }))
        .finally(() => {
          setLoader(false);
        });
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onButtonSubmit}
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
              className="input is-danger"
              value={query}
              onChange={handleQuery}
            />
          </div>
          { (hasError) && (
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
              className={cn('button is-light', { 'is-loading': loader })}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            { movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    onClick(movie);
                    setQuery('');
                    setMovie(null);
                  }
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
