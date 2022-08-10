import React, { useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';
import { getFilmByTitle } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

type Props = {
  movies: Movie[],
  onChange: (film: Movie) => void,
};

export const FindMovie: React.FC<Props> = (
  { movies, onChange: adderMovie },
) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [duble, setDuble] = useState(false);
  const [activator, setActivator] = useState(true);

  const findMovie = () => {
    getFilmByTitle(title)
      .then(film => {
        if (film.Error) {
          setError(true);
        } else {
          return (
            setPreview(film),
            setActivator(false)
          );
        }

        return null;
      });
  };

  const addmovie = () => {
    setActivator(true);

    if (preview
      && movies.every(movie => movie.imdbID !== preview.imdbID)) {
      adderMovie(preview);
    }

    if (movies.some(movie => movie.imdbID === preview?.imdbID)) {
      setDuble(true);
    }

    setPreview(null);
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
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
              className={classnames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
                setDuble(false);
              }}
            />
          </div>

          {error
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              disabled={!title}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              data-cy="add"
              className="button is-primary"
              disabled={activator}
              onClick={addmovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {duble
          ? (
            <h2 className="title">Looks like, you already have this movie</h2>
          )
          : (
            <>
              {preview && (
                <>
                  <h2 className="title">Preview</h2>
                  <MovieCard movie={preview} />
                </>
              )}
            </>
          )}
      </div>
    </>
  );
};
