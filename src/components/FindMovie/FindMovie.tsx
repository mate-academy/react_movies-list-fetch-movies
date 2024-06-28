import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { FindMovieProps } from '../../types/FindMovieProps';

export const FindMovie: React.FC<FindMovieProps> = ({ addToList }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setMovieNotFound(true);
        } else {
          const foundMovie = {
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovieNotFound(false);
          setMovie(foundMovie);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setMovieNotFound(false);
  };

  const handleAddToList = (movieToAdd: Movie) => {
    setQuery('');
    setMovieNotFound(false);
    setIsLoading(false);
    setMovie(undefined);
    addToList(movieToAdd);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': movieNotFound,
              })}
            />
          </div>

          {movieNotFound && (
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
              className={classNames('button is-primary', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {`${!movie ? 'Find a movie' : 'Search again'}`}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-light"
                onClick={() => handleAddToList(movie)}
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
