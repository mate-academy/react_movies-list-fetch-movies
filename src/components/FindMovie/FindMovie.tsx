/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { movieFetch } from '../../api/fetchMovie';

import { Movie } from '../../Types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const getMovie = async () => {
    try {
      const foundMovie: Movie = await movieFetch(title);

      setPreviewMovie(foundMovie);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        'An error has occurred when requesting movie from the server',
      );
    }
  };

  const addMovieToList = () => {
    if (previewMovie?.Response === 'True') {
      addMovie(previewMovie);
      setTitle('');
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
              value={title}
              className={classNames('input', { 'is-danger': previewMovie?.Response === 'False' })}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          {previewMovie?.Response === 'False' && (
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
              onClick={() => getMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previewMovie?.Response === 'True' && <MovieCard movie={previewMovie} />}
      </div>
    </>
  );
};
