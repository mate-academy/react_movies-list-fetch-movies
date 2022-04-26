import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { request } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [notFound, setNotFound] = useState(false);

  const inputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setNotFound(false);
  };

  const loadMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const findMovie = await request(title);

    if (findMovie.Error) {
      setNotFound(true);
      setMovie({
        Poster: '',
        Title: '',
        Plot: '',
        imdbID: '',
      });
    } else {
      setMovie(findMovie);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={loadMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={title}
              className={classNames(
                'input',
                { 'is-danger': notFound },
              )}
              onChange={inputTitle}
            />
          </div>

          {notFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAddMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>
    </>
  );
};
