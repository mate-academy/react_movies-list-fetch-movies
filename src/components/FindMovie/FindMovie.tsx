import React, { useState } from 'react';

import { MovieCard } from '../MovieCard';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
}) => {
  const [query, setQuery] = useState<string>('');
  const [
    searchError,
    setSearchError,
  ] = useState<ResponseError | undefined>(undefined);
  const [
    searchedMovie,
    setSearchedMovie,
  ] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const clearFindMovieComponent = (searchedMovie: Movie) => {
    onAddMovie(searchedMovie);
    setQuery('');
    setSearchedMovie(null);
  };

  const handleFindMovie = async (
    e: React.SyntheticEvent,
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await getMovie(query)
        .then(data => {
          if ('Error' in data) {
            setSearchError(data);
          } else {
            if (searchError) {
              setSearchError(undefined);
            }

            setSearchedMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl: data.Poster,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
              imdbId: data.imdbID,
            });
          }
        });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchMovie = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={handleFindMovie}
        className="find-movie"
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
              className={`input ${searchError && query.trim() && 'is-danger'}`}
              value={query}
              onChange={handleSearchMovie}
            />
          </div>

          {searchError && query.trim() ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped loader-centr">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={!query.trim() && true}
            >
              Find a movie
            </button>
          </div>

          {searchedMovie
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => clearFindMovieComponent(searchedMovie)}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      {searchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchedMovie} />
        </div>
      )}
    </>
  );
};
