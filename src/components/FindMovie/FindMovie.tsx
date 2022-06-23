import React, { Dispatch, SetStateAction, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getFilmByTitle } from '../../API/api';
import { MovieCard } from '../MovieCard';

type Props = {
  selectedMovie: Dispatch<SetStateAction<Movie[]>>,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ selectedMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const findMovie = () => {
    getFilmByTitle(title)
      .then(film => {
        if (film.Error) {
          setError(true);
        } else {
          return setPreview(film);
        }

        return null;
      });
  };

  const addmovie = () => {
    if (preview
      && movies.every(movie => movie.imdbID !== preview.imdbID)) {
      selectedMovie(current => [...current, preview]);
    }

    if (movies.some(movie => movie.imdbID === preview?.imdbID)) {
      setDuplicate(true);
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
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
                setDuplicate(false);
              }}
            />
          </div>

          {error
            && (
              <p className="help is-danger">
                Sorry, we cannot find such movie
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
              disabled={error}
              onClick={addmovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {duplicate
          ? (
            <h2 className="title">Sorry, you cannot dublicate movies</h2>
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
