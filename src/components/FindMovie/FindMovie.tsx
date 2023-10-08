import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies, setMovies,
}) => {
  const [query, setQuery] = useState<string>('');
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const searchMovie = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(res => {
        if ('Error' in res) {
          setErrorMessage(true);

          return;
        }

        const newMovie: Movie = {
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster,
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        };

        setFindMovie(newMovie);
      })
      .finally(() => setLoading(false));
  };

  const reset = () => {
    setQuery('');
    setFindMovie(null);
  };

  const addMovie = () => {
    if (!findMovie) {
      return;
    }

    if (movies.find(movie => movie.imdbId === findMovie.imdbId)) {
      reset();

      return;
    }

    setMovies([...movies, findMovie]);
    reset();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
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
              className={classNames(
                'input',
                { 'is-danger': errorMessage },
              )}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setErrorMessage(false);
              }}
            />
          </div>

          {errorMessage && (
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
                'button is-light',
                { 'is-loading': loading },
              )}
              disabled={query === ''}
              onClick={searchMovie}
            >
              {!findMovie ? (
                'Find a movie'
              ) : (
                'Search again'
              )}
            </button>
          </div>

          {findMovie && (
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

      {findMovie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
