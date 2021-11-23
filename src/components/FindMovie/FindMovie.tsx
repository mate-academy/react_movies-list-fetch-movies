import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { findMovieByTitle } from '../api';

export interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [movieNotFound, setMovieNotFound] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const clearForm = () => {
    setTitle('');
    setShowPreview(false);
  };

  const findMovieButtonHandler = async (movieTitle: string) => {
    try {
      const movieFromServer = await findMovieByTitle(movieTitle);

      if (movieFromServer) {
        setMovie(movieFromServer);

        setMovieNotFound(false);
        setShowPreview(true);
      }
    } catch {
      setMovieNotFound(true);
      clearForm();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addMovie(movie);
    clearForm();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setMovieNotFound(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': movieNotFound })}
                value={title}
                onChange={handleChange}
              />
            </div>
          </label>
          {movieNotFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              value={title}
              onClick={() => findMovieButtonHandler(title)}
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
        <h2 className="title">Preview</h2>
        {showPreview && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
