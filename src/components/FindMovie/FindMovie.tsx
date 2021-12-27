/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (film: Movie) => void
};

function getFilm(title: string) {
  return fetch(`https://www.omdbapi.com/?apikey=c2c705e9&t=${title}`)
    .then(response => response.json());
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  async function findMovie() {
    setLoading(true);
    const film = await getFilm(title);

    try {
      if (film.Response === 'False') {
        setHasLoadingError(true);
      } else {
        setMovie(film);
      }
    } catch (error) {
      setHasLoadingError(true);
    } finally {
      setLoading(false);
    }
  }

  let classNameInputTitle = 'input';

  if (hasLoadingError) {
    classNameInputTitle += ' is-danger';
  }

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
              className={classNameInputTitle}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setHasLoadingError(false);
              }}
            />
          </div>
          {loading && <p>Loading</p>}
          {hasLoadingError && (
            <p className="help is-danger">
              `Can't find a movie with such a title`
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
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setTitle('');
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
