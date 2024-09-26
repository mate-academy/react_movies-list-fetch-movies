import './FindMovie.scss';

import React, { FormEvent, useState } from 'react';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC<{
  handleFindMovie: (query: string) => Promise<MovieData | ResponseError>;
  handleAddMovie: (newMovie: Movie) => void;
}> = ({ handleFindMovie, handleAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchFailed, setSearchFailed] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    handleFindMovie(query)
      .then(response => {
        if (response.Response === 'True') {
          setFoundMovie({
            description: response.Plot,
            imdbId: response.imdbID,
            title: response.Title,
            imgUrl:
              response?.Poster && response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          });
          setSearchFailed(false);
        } else {
          setSearchFailed(true);
        }
      })
      .catch(reason => {
        throw new Error(reason);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAdd() {
    handleAddMovie(foundMovie as Movie);
    setQuery('');
    setFoundMovie(null);
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={'input ' + (searchFailed ? ' is-danger ' : ' ')}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSearchFailed(false);
              }}
            />
          </div>

          {searchFailed && (
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
              className={'button is-light' + (isLoading ? ' is-loading ' : ' ')}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
