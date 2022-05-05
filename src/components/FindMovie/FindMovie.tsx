import React, { useState } from 'react';
import './FindMovie.scss';
import { getData } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (value: Movie) => void,
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [errorTitle, setErrorTitle] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorTitle(false);
    setTitle(event.target.value);
  };

  const getFindMovie = () => {
    getData(title)
      .then(response => {
        if (!response.Error) {
          setMovie(response);
        } else {
          setMovie(null);
          setErrorTitle(true);
        }
      });
  };

  const getMovieToList = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setTitle('');
      setErrorTitle(false);
    }
  };

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
              className={`input ${errorTitle && 'is-danger'}`}
              value={title}
              onChange={handleChange}
            />
          </div>
          {errorTitle && (
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
              onClick={getFindMovie}
            >
              Find a movie
            </button>
          </div>
          {movie
          && (
            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={getMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {movie
          && <MovieCard movie={movie} />}
      </div>
    </>
  );
});
