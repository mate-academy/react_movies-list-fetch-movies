import React, { useState } from 'react';
import './FindMovie.scss';
// import classNames from 'classnames'
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieError, setMovieError] = useState(false);

  const loadMovie = async () => {
    const APIMovie: APIMovie = await getMovie(title);

    if (APIMovie.Response === 'False') {
      setMovieError(true);
      setMovie(null);

      return;
    }

    setMovieError(false);

    const newMovie: Movie = {
      title: APIMovie.Title,
      description: APIMovie.Plot,
      imgUrl: APIMovie.Poster,
      imdbId: APIMovie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${APIMovie.imdbID}`,
    };

    setMovie(newMovie);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setMovieError(false);
    setTitle(value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    loadMovie();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="find-movie"
      >
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
              name="title"
              value={title}
              onChange={handleChange}
            />
          </div>

          {movieError && (
            <p className="help is-danger">
              Cannot find the film with such title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                addMovie(movie as Movie);
                setMovie(null);
              }}
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
