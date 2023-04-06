import cn from 'classnames';
import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie, convertData } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [searchResult, setSearchResult] = useState<MovieData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const submitQuery = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // setHasError(false);

    getMovie(query)
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          setSearchResult(response);
        } else {
          setHasError(true);
          setErrorMessage(response.Error);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addMovieToTheList = () => {
    if (searchResult) {
      addMovie(convertData(searchResult));
      setQuery('');
      setSearchResult(null);
    }
  };

  useEffect(() => {
    setHasError(false);
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={submitQuery}>
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
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>
          {searchResult && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchResult && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={convertData(searchResult)} />
        </div>
      )}
    </>
  );
};
