import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { getMovie } from '../../api';

interface Props {
  setMovieList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ setMovieList }) => {
  const [title, setValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const findHandler = async () => {
    const movieFromServer = await getMovie(title);

    setMovie(movieFromServer);
  };

  const addMovie = () => {
    if (movie) {
      setMovieList(movie);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovie();
          setMovie(null);
        }}
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
                  'is-danger': !title,
                })}
                value={title}
                onChange={(event) => {
                  setValue(event.target.value);
                }}
              />
            </div>
          </label>
          <p className="help is-danger">
            { !movie && 'Can\'t find a movie with such a title'}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findHandler}
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
        <MovieCard movie={movie} />
      </div>
    </>
  );
};
