import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
type Props = {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
};

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError) {
      setHasError(false);
    }

    setQuery(event.target.value.trimStart());
  };

  const onReset = () => {
    setQuery('');
    setMovie(null);
    setHasError(false);
  };

  const handleOnSubmitFind = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setHasError(true);
        } else {
          const { Poster, Title, Plot, imdbID } = data;

          if (movies.some(item => item.imdbId === imdbID)) {
            onReset();

            return;
          }

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddToTheList = () => {
    if (movie && !movies.some(item => item.imdbId === movie.imdbId)) {
      onAddMovie(movie);
    }

    onReset();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmitFind}>
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleChangeQuery}
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
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
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
                onClick={handleAddToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
