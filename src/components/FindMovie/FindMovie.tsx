import React, { useState } from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api/movie';
import './FindMovie.scss';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleQuery, setTitleQuery] = useState<Movie['Title']>('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const findMovie = async () => {
    try {
      const foundMovie: Movie = await getMovie(titleQuery);

      setMovie(foundMovie);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'An error has occurred when requesting movie from the server',
      );
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie?.Response === 'True') {
      addMovie(movie);
      setTitleQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                value={titleQuery}
                id="movie-title"
                placeholder="Enter a title to search"
                onChange={(event) => setTitleQuery(event.target.value)}
                className={classNames('input', {
                  'is-danger': movie?.Response === 'False',
                })}
              />
            </div>
          </label>

          {movie?.Response === 'False' && (
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
            <button type="submit" className="button is-primary">
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie?.Response === 'True' && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
