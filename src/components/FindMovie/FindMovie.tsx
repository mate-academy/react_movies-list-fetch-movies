import React, { Dispatch, SetStateAction, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';

import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

import { MovieCard } from '../MovieCard';

type Props = {
  currentMovie: Movie | null;
  movies: Movie[];
  setMovie: (x: Movie | null) => void;
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  currentMovie,
  setMovie,
  setMovies,
  movies,
}) => {
  const [title, setTitle] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const preLoadSets = () => {
    setIsloading(true);
    if (title.trim() !== '') {
      setHasError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    preLoadSets();
    getMovie(title)
      .then(movieData => {
        if ('Error' in movieData) {
          setHasError(true);

          return;
        }

        const data = movieData;

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      })
      .catch(() => {})
      .finally(() => {
        setIsloading(false);
      });
  };

  const reset = () => {
    if (title || currentMovie) {
      setTitle('');
      setMovie(null);
    }
  };

  const isHavingMovie = () => {
    return (
      movies.findIndex(movie => movie.title === currentMovie?.title) === -1
    );
  };

  const handleAddMovie = (movieToAdd: Movie) => {
    if (isHavingMovie()) {
      setMovies(prev => [...prev, movieToAdd]);
    }

    reset();
  };

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
              className={cn('input', { 'is-danger': hasError })}
              onChange={e => {
                setTitle(e.currentTarget.value);
                setHasError(false);
              }}
              value={title}
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
              className={cn('button is-light', { 'is-loading': isloading })}
              disabled={!title}
            >
              {!currentMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {currentMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(currentMovie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
