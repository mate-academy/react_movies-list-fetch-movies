import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

const defaultPoster =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState('');

  const allClear = () => {
    setIsError(false);
    setMovie(null);
    setQuery('');
    setAppliedQuery('');
  };

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setIsError(false);
  }

  function handleOnFindClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (query) {
      setAppliedQuery(query);
    }
  }

  function handleOnAddClick() {
    if (movie) {
      addMovie(movie);
    }

    allClear();
  }

  useEffect(() => {
    if (appliedQuery) {
      setIsLoading(true);
      getMovie(appliedQuery)
        .then(res => {
          if (res.Response === 'True') {
            const imgUrl = res.Poster === 'N/A' ? defaultPoster : res.Poster;
            const imdbUrl = `https://www.imdb.com/title/${res.imdbID}`;
            const movieData = {
              title: res.Title,
              description: res.Plot,
              imgUrl,
              imdbUrl,
              imdbId: res.imdbID,
            };

            setIsError(false);
            setMovie(movieData);
          } else {
            setIsError(true);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [appliedQuery]);

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
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={handleOnChange}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              onClick={handleOnFindClick}
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
                onClick={handleOnAddClick}
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
