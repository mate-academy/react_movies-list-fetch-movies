import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { request } from '../../api/movies';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, findTitle] = useState<Movie['Title']>('');
  const [movie, setMovie] = useState<Movie>({} as Movie);

  const getMovie = (movieName: Movie['Title']) => request(movieName);

  const findMovie = async () => {
    try {
      const result: Movie = await getMovie(title);

      setMovie(result);
    } catch (error) {
      Error(`${movie.Error}`);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          Movie title

          <div className="control">
            <input
              type="text"
              name="title"
              value={title}
              placeholder="Enter a title to search"
              className={classnames('input', {
                'is-danger': movie.Response === 'False',
              })}
              onChange={(event) => {
                findTitle(event.target.value);
              }}
            />
          </div>

          {movie.Response === 'False' && (
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
              onClick={() => {
                findMovie();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie.Response === 'True') {
                  onAdd(movie);
                  findTitle('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.Response === 'True' && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
