import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

const DEFAULT_POSTER = `https://via.placeholder.com/360x270.png?text=no%20preview`;

export const FindMovie: React.FC<FindMovieProps> = ({ setMovies }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmed = movieTitle.trim();

    if (!trimmed) {
      return;
    }

    setError('');
    setIsLoading(true);

    getMovie(trimmed)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          throw new Error("Can't find a movie with such a title");
        }

        const { Title, Plot, Poster, imdbID } = data as MovieData;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster !== 'N/A' ? Poster : DEFAULT_POSTER,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        setError('');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    setError('');
  };

  const handleClick = () => {
    if (!movie) {
      return;
    }

    setMovies(currentMovies => {
      const isMovieInMovies = currentMovies.some(
        m => m.imdbId === movie.imdbId,
      );

      return isMovieInMovies ? currentMovies : [...currentMovies, movie];
    });

    setMovie(null);
    setMovieTitle('');
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
              className={cn('input', {
                'is-danger': error,
              })}
              value={movieTitle}
              onChange={handleChangeInput}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
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
              disabled={movieTitle === ''}
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
                onClick={handleClick}
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
