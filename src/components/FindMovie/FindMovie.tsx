import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFound, setFound] = useState(true);

  const loadMovie = async () => {
    const APIMovie: MovieApi = await getMovie(title);

    if (APIMovie.Response === 'False') {
      setMovie(null);
      setFound(false);
    } else {
      const newMovie: Movie = {
        title: APIMovie.Title,
        description: APIMovie.Plot,
        imgUrl: APIMovie.Poster,
        imdbId: APIMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${APIMovie.imdbID}`,
      };

      setMovie(newMovie);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
    setFound(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addMovie(movie as Movie);
    setTitle('');
    setMovie(null);
    setFound(true);
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
          </label>

          <div className="control">
            <input
              type="text"
              value={title}
              name="title"
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isFound })}
            />
          </div>

          {!isFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={loadMovie}
              className="button is-light"
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
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
