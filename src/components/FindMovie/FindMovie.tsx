import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

// eslint-disable-next-line
const imdbUrl = 'https://mate-academy.github.io/react_movies-list-fetch-movies/images/imdb-logo.jpeg';
const defPoster = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(item => {
        if ('Error' in item) {
          setError(true);
        } else {
          const {
            Title, Plot, Poster, imdbID,
          } = item;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster || defPoster,
            imdbUrl,
            imdbId: imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addMovie = () => {
    if (movie && !movies.find(item => item.imdbId === movie.imdbId)) {
      setMovies(movies.concat(movie));
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandler}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              className={classNames(
                'button', 'is-light', { 'is-loading': isLoading },
              )}
              disabled={Boolean(!query)}
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
                onClick={addMovie}
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
