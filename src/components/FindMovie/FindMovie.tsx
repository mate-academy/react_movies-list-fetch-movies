import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type P = {
  addMovie: (movie: Movie) => void;
};

const normalizeMovie = (movie: MovieData): Movie => {
  return {
    title: movie.Title,
    description: movie.Plot,
    imgUrl: movie.Poster === 'N/A' ? DEFAULT_IMG : movie.Poster,
    imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
    imdbId: movie.imdbID,
  };
};

export const FindMovie: React.FC<P> = ({ addMovie }) => {
  const [query, setQuery] = useState('');

  const [movie, setMovie] = useState<Movie | null>();
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState('');

  const updateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
    setErrors('');
  };

  const findMovie = (event: React.MouseEvent) => {
    event.preventDefault();

    setLoading(true);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setErrors(response.Error);
          setMovie(null);
        } else {
          setMovie(normalizeMovie(response));
        }
      })
      .finally(() => setLoading(false));
  };

  const applyMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
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
              className="input is-danger"
              value={query}
              onChange={updateQuery}
            />
          </div>

          {errors.length > 0 && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query}
              onClick={findMovie}
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
                disabled={!movie}
                onClick={applyMovie}
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
