import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [status, setStatus] = useState(true);
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  const loadMovie = async () => {
    const requestedMovie = await getMovie(title);

    if (requestedMovie.imdbID) {
      setStatus(true);
      setMovie(requestedMovie);
    } else {
      setStatus(false);
    }
  };

  const clearState = () => {
    setMovie({
      Poster: '',
      Title: '',
      Plot: '',
      imdbID: '',
    });
  };

  const addMovieToTheList = () => {
    const isDuplicate = movies.find(item => item.imdbID === movie.imdbID);

    if (!isDuplicate && movie.imdbID) {
      addMovie(movie);
      clearState();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(true);
    setTitle(event.target.value);
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
              className={classNames(
                'input',
                { ' is-danger': !status },
              )}
              onChange={handleChange}
            />
          </div>
          {!status && (
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
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToTheList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie.Title && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
