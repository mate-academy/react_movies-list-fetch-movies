import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

import clsx from 'clsx';
import { MovieData } from '../../types/MovieData';

const normalizeMovieData = (movieData: MovieData): Movie => {
  const movieImg =
    movieData.Poster !== 'N/A'
      ? movieData.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieImg,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
    imdbId: movieData.imdbID,
  };
};

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieError, setIsMovieError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = title.trim();

    if (!query) {
      setIsMovieError(true);

      return;
    }

    setIsLoading(true);
    getMovie(query)
      .then(movieData => {
        if ('Error' in movieData) {
          setIsMovieError(true);

          return;
        }

        setIsMovieError(false);
        setMovie(normalizeMovieData(movieData));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isMovieError) {
      setIsMovieError(false);
    }

    if (movie) {
      setMovie(null);
    }

    setTitle(event.currentTarget.value);
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    onAddMovie(movie);
    setMovie(null);
    setTitle('');
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
              className={clsx('input', {
                'is-danger': isMovieError,
              })}
              onChange={handleTitleChange}
              value={title}
            />
          </div>
          {isMovieError && (
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
              className={clsx('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
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
