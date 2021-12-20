import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovies } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;

  const [title, setTitle] = useState('');
  const [foundMovie, showMovie] = useState<Movie | null>(null);
  const [foundStatus, setFoundStatus] = useState(true);

  const findMovie = async () => {
    try {
      const movie = await getMovies(title);

      if (movie.Response === 'False') {
        showMovie(null);
        setFoundStatus(false);
      } else {
        showMovie(movie);
        setFoundStatus(true);
      }
    } catch (error) {
      showMovie(null);
      setFoundStatus(false);
    }
  };

  const handleSumbit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (foundMovie) {
      addMovie(foundMovie);
    }

    setTitle('');
    showMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSumbit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': !foundStatus })}
                value={title}
                onChange={(event) => {
                  setFoundStatus(true);
                  setTitle(event.target.value);
                }}
              />
            </div>
          </label>
          {!foundStatus && (
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
              onClick={findMovie}
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

      {
        foundMovie && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard movie={foundMovie} />
          </div>
        )
      }
    </>
  );
};
