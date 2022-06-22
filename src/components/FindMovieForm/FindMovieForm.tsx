import React, { useState } from 'react';
import { searchMovies } from '../../api';

interface Props {
  setMoviesFSState: (arg: Movie[], arg2: Movie) => void;
  movies: Movie[];
  setSameMovieFSState: (arg: boolean) => void;
  setMovieFSState: (arg: Movie | null) => void;
  movie: Movie | null;
}

export const FindMovieForm: React.FC<Props> = ({
  setMoviesFSState,
  movies,
  setSameMovieFSState,
  setMovieFSState,
  movie,
}) => {
  const [query, setQuery] = useState('');
  const [movieNotEhist, setMovieNotEhist] = useState(false);

  const findeMovie = (title: string) => {
    searchMovies(title)
      .then(res => {
        if (res.Response === 'False') {
          setMovieFSState(null);
          setMovieNotEhist(true);

          return null;
        }

        return setMovieFSState(res);
      });
  };

  const addMovieToList = () => {
    if (!movies.some(el => el.imdbID === movie?.imdbID)) {
      if (movie) {
        setMoviesFSState(movies, movie);
        setMovieFSState(null);
        setQuery('');
      }
    } else {
      setSameMovieFSState(true);
    }
  };

  const submitEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie) {
      addMovieToList();
    }
  };

  return (
    <form
      className="find-movie"
      onSubmit={(event) => {
        submitEvent(event);
      }}
    >
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className={`input ${movieNotEhist && 'is-danger'}`}
            value={query}
            onChange={event => {
              setQuery(event.target.value);
              setMovieNotEhist(false);
              setSameMovieFSState(false);
            }}
          />
        </div>

        {movieNotEhist && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        )}

      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            data-cy="find"
            type="button"
            className="button is-light"
            onClick={() => {
              findeMovie(query);
            }}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            data-cy="add"
            type="submit"
            className="button is-primary"
            disabled={movieNotEhist}
          >
            Add to the list
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button is-danger"
            onClick={() => {
              setQuery('');
              setMovieNotEhist(false);
              setMovieFSState(null);
              setSameMovieFSState(false);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
