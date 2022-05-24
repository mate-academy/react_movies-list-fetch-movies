import React, { useCallback, useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleChangeInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  }, []);

  const handleSubmit = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  const findMovie = async () => {
    if (!title) {
      return;
    }

    const newMovie = await getMovie(title);

    if (!newMovie.Title) {
      setTitleError(true);

      return;
    }

    setMovie(newMovie);
    setTitleError(false);
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
              className="input is-danger"
              value={title}
              onChange={handleChangeInput}
            />
          </div>
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
              onClick={handleSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
