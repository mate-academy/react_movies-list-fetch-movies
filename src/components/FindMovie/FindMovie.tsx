import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { getMovie } from '../../api/movies';
import { MovieCard } from '../MovieCard';

type Props = {
  addNewMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [movie, setMovie] = useState({} as Movie);
  const [isMovieInList, setMovieInList] = useState(false);

  const [title, setTitle] = useState('');

  const [isError, setError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const searchMovie = async () => {
    if (!isMovieInList || movie.Title.localeCompare(title, undefined)) {
      try {
        const foundMovie = await getMovie(title.trim());

        setMovie(foundMovie);
        setMovieInList(true);
      } catch (error) {
        setError(true);
      }
    }
  };

  const addMovieToList = () => {
    addNewMovie(movie);

    setTitle('');
    setMovieInList(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                value={title}
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': isError })}
                onChange={handleChange}
              />
            </div>
          </label>

          {isError && (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isMovieInList && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
