import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { movieContext, ContextType } from '../../Contexts/Contexs';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const {
    query, setQuery, fetchedMovie, setFetchedMovie, movies, setMovies,
  }
    = useContext(movieContext) as ContextType;
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [query]);

  function addMovie() {
    if (
      !fetchedMovie
      || movies.some((movie) => movie.imdbId === fetchedMovie.imdbId)
    ) {
      setFetchedMovie(null);

      return;
    }

    setMovies((prev) => {
      const updatedMovies = [
        ...prev.filter((movie) => movie.imdbId !== fetchedMovie?.imdbId),
        fetchedMovie,
      ];

      return updatedMovies;
    });

    setFetchedMovie(null);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((response) => {
        const error = response as ResponseError;

        if (error.Response === 'False') {
          throw new Error();
        }

        const succResponse = response as MovieData;

        const imageSrc
          = succResponse.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : succResponse.Poster;

        const movie: Movie = {
          title: succResponse.Title,
          description: succResponse.Plot,
          imgUrl: imageSrc,
          imdbId: succResponse.imdbID,
          imdbUrl: `https://www.imdb.com/title/${succResponse.imdbID}`,
        };

        setFetchedMovie(movie);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {fetchedMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {fetchedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={fetchedMovie} />
        </div>
      )}
    </>
  );
};
