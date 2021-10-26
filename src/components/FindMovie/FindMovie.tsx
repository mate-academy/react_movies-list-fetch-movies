import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { getMovieFromServer } from '../../api/apiMovies';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [searchFailed, setSearchFailed] = useState(false);

  const findMovie = async () => {
    const foundMovie = await getMovieFromServer(title);

    setMovie(foundMovie);
    setSearchFailed(!foundMovie);
  };

  const hadleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setMovie(null);
      setTitle('');
    }
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
                className={classNames('input', {
                  'is-danger': searchFailed,
                })}
                value={title}
                onChange={hadleChangeTitle}
              />
            </div>
          </label>

          {searchFailed
          && (
            <p className={classNames('help', {
              'is-danger': searchFailed,
            })}
            >
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie
        && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
