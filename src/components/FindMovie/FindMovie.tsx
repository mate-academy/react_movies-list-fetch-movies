import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie | null) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isShowError, setIsShowError] = useState(false);

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const findMovieByTitle = () => {
    getMovie(title)
      .then(response => {
        if (response.Response === 'False') {
          setIsShowError(true);
          setMovie(null);
        } else {
          setIsShowError(false);
          setMovie(response);
        }
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addMovie(movie);
    setTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                onChange={handleChangeTitle}
                placeholder="Enter a title to search"
                className="input is-danger"
              />
            </div>
          </label>

          {!movie && isShowError && (
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
              onClick={findMovieByTitle}
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

      {movie !== null && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
