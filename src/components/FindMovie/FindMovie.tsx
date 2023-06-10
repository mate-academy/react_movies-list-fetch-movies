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
  ] = useState<Movie | undefined>(undefined);

  const handleFindMovie = () => getMovie(query)
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

  const handleSearchMovie = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFindMovie();
        }}
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
              className={`input ${searchError && 'is-danger'}`}
              value={query}
              onChange={handleSearchMovie}
            />
          </div>

          {searchError && (
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
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          {searchedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovie(searchedMovie);
                  setQuery('');
                  setSearchedMovie(undefined);
                }}
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
