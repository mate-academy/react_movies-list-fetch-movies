import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

interface Props {
  addMovie: (movie: Movie) => void
}

export const FindMovie:React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [visibleMovie, setMovie] = useState(null);
  const [visibleEror, setEror] = useState(false);

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const submitSerch = () => {
    getMovie(query).then(movie => {
      if (movie.Response === 'False') {
        setEror(true);
        setMovie(null);
      } else {
        setEror(false);
        setMovie(movie);
      }
    });
  };

  const addVisibleMovie = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    if (visibleMovie) {
      addMovie(visibleMovie);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={addVisibleMovie}>
        <div className="field">
          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={query}
                onChange={onChangeQuery}
              />
            </label>
          </div>
          {visibleEror && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={submitSerch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {visibleMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={visibleMovie} />
          </>
        )}
      </div>
    </>
  );
};
