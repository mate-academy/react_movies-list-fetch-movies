import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovieToList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNotfound, setIsNotFound] = useState<ResponseError | null>(null);

  const handleInputQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotFound(null);
    setQuery(event.target.value);
  };

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (query) {
      const prearedQuery = query.trim().toLowerCase();

      getMovie(prearedQuery)
        .then(response => {
          if (Object.hasOwn(response, 'Title')) {
            const {
              Poster,
              Title,
              Plot,
              imdbID,
            } = response as MovieData;

            const imgUrl = Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster;

            const newMovie = {
              title: Title,
              description: Plot,
              imgUrl,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            };

            setMovie(newMovie);
            setIsNotFound(null);
          }

          if (Object.hasOwn(response, 'Error')) {
            setIsNotFound(response as ResponseError);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleAddMovie = (film: Movie) => {
    addMovieToList(film);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              className={cn('input', { 'is-danger': isNotfound?.Error })}
              value={query}
              onChange={handleInputQuery}
            />
          </div>

          {isNotfound?.Error && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a Movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
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
