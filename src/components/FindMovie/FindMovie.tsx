import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  addMovie: (movie: Movie) => void;
};

const DEFAULT = {
  PICTURE: 'https://via.placeholder.com/360x270.png?text=no%20preview',
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
  };

  const normalizeMovie = (data: MovieData): Movie => ({
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? DEFAULT.PICTURE : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const trimmedQuery = query.trim();

    getMovie(trimmedQuery)
      .then((res: MovieData | ResponseError) => {
        if ('Error' in res) {
          setHasError(true);
          setMovie(null);
        } else {
          setMovie(normalizeMovie(res));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
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
              value={query}
              className={cn('input', { 'is-danger': hasError })}
              onChange={handleOnChange}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
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
                onClick={handleAddMovie}
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
