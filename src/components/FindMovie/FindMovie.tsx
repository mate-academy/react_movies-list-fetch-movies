import React, { useState } from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api/movies';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState(false);

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value.toLowerCase());
    setMovieError(false);
  };

  const handleSearchQuery = async () => {
    const newMovie = await getMovie(title);

    if (newMovie.Response === 'True') {
      setMovie(newMovie);
      setMovieError(false);
    } else {
      setMovie(null);
      setMovieError(true);
    }
  };

  const handleOnSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { addMovie } = props;

    if (movie) {
      addMovie(movie);
      setMovie(null);
    }
  };

  return (
    <div>
      <form
        className="find-movie"
        onSubmit={handleOnSubmitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={title}
                onChange={handleTitleInput}
              />
            </div>
          </label>

          {movieError && (
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
              onClick={handleSearchQuery}
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </div>
  );
};
