import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

interface Props {
  addMovieToList: AddMovieToList;
}

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [titleError, setTitleError] = useState<string>('');

  const findMovie = async () => {
    const findedMovie = await getMovie(searchTitle.trim());

    if (findedMovie.Error) {
      setTitleError(findedMovie.Error);
      setMovie(null);

      return;
    }

    setMovie(findedMovie);
    setTitleError('');
  };

  const addFindedMovie = () => {
    addMovieToList(movie);
    setSearchTitle('');
    setMovie(null);
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
                id="movie-title"
                value={searchTitle}
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': titleError })}
                onChange={(e) => {
                  setSearchTitle(e.target.value);
                  setTitleError('');
                }}
              />
            </div>
          </label>

          {titleError && (
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
              type="button"
              className="button is-primary"
              onClick={addFindedMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
