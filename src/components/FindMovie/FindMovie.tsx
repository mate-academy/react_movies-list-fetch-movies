import React, { FormEvent, useState } from 'react';

import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

const DEFAULT_POSTER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

function normalizeMovie(movieData: MovieData): Movie {
  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: movieData.Poster === 'N/A' ? DEFAULT_POSTER : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setMovie(null);

    getMovie(normalizedTitle)
      .then(response => {
        if ('Error' in response) {
          setHasError(true);

          return;
        }

        setMovie(normalizeMovie(response));
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    onMovieAdd(movie);

    setTitle('');
    setMovie(null);
    setHasError(false);
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
              className={`input ${hasError ? 'is-danger' : ''}`}
              value={title}
              onChange={handleTitleChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim() || isLoading}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
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
