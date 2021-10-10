import * as React from 'react';
import { useState } from 'react';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');

  const findMovie = async () => {
    if (title.length > 0 && title !== '') {
      setTitle('');

      const movieFromApi: Movie = await getMovie(title);

      setMovie(movieFromApi);
    } else if (title === '') {
      setMovie(null);
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
              className="input is-danger"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
