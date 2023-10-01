import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({
  movies,
  addMovie,
}) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const handlerChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handlerMovieSearch = () => {
    setLoading(true);

    getMovie(title.toLowerCase().trim())
      .then(res => {
        if ('Response' in res && res.Response === 'False') {
          setHasError(true);
          setMovie(null);
        } else {
          const newRes = res as MovieData;
          const newMovie: Movie = {
            title: newRes.Title || '...has no title...',
            description: newRes.Plot || '',
            imgUrl: newRes.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : newRes.Poster,
            imdbUrl: `https://www.imdb.com/title/${newRes.imdbID}`,
            imdbId: newRes.imdbID,
          };

          setMovie(newMovie);
          setHasError(false);
        }
      })
      .finally(() => setLoading(false));
  };

  const handlerSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handlerMovieSearch();
  };

  const handlerAddMovie = (newMovie: Movie) => {
    if (newMovie) {
      if (movies.every((elem) => elem.imdbId !== newMovie.imdbId)) {
        addMovie(newMovie);
      }

      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerSearchSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': hasError,
              })}
              onChange={handlerChangeTitle}
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
              type="button"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={title.trim().length === 0}
              onClick={handlerMovieSearch}
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
                onClick={() => handlerAddMovie(movie)}
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
