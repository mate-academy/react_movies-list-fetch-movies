import React, { useState } from 'react';
import { searchMovies } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: (arg: Movie[]) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieNotEhist, setMovieNotEhist] = useState<boolean>(false);
  const [sameMovie, setSameMovie] = useState<boolean>(false);

  const findeMovie = (title: string) => {
    searchMovies(title)
      .then(res => {
        if (res.Response === 'False') {
          setMovie(null);
          setMovieNotEhist(true);

          return null;
        }

        return setMovie(res);
      });
  };

  const addMovieToList = () => {
    if (!movies.some(el => el.imdbID === movie?.imdbID)) {
      if (movie) {
        setMovies([...movies, movie]);
        setMovie(null);
        setQuery('');
      }
    } else {
      setSameMovie(true);
    }
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${movieNotEhist && 'is-danger'}`}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setMovieNotEhist(false);
                setSameMovie(false);
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
                if (query === '') {
                  return;
                }

                findeMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="add"
              type="button"
              className="button is-primary"
              disabled={movieNotEhist}
              onClick={() => {
                if (movie) {
                  addMovieToList();
                }
              }}
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
                setMovie(null);
                setSameMovie(false);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {sameMovie && (
          <p
            className="has-text-danger mb-5"
          >
            This movie is alredy exist in your library
          </p>
        )}

        {movie && <MovieCard movie={movie} />}

      </div>
    </>
  );
};
