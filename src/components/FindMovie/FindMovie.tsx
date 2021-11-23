import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieNotFound, setMovieNotFound] = useState(false);
  const [titleChanged, setTitleChanged] = useState(true);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setTitleChanged(true);
  };

  const handleFindButton = async () => {
    try {
      const movieFromServer = await getMovies(title);

      if (movieFromServer) {
        setMovie(movieFromServer);
        setMovieNotFound(false);
        setTitleChanged(true);
      }
    } catch (error) {
      setMovieNotFound(true);
      setMovie(null);
      setTitleChanged(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTitle('');
    addMovie(movie as Movie);
  };

  return (
    <>
      <h1>Find the movie</h1>
      <form
        onSubmit={handleSubmit}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'is-danger': !titleChanged })}
                onChange={handleChangeInput}
              />
            </div>
          </label>

          {titleChanged || movie ? null : (
            <p className="help is-danger">
              The movie was not found
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => handleFindButton()}
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
        {movieNotFound && (<h1>Movie not found</h1>)}
        {movie && (<MovieCard movie={movie as Movie} />)}
      </div>
    </>
  );
};
