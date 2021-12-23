import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';

import { getMovies } from '../../api/api';

type Props = {
  addMovie: (addedMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');

  const searchMovie = async () => {
    const movieFound = await getMovies(title);

    setMovie(movieFound);
  };

  const handleFormSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie?.Response === 'True') {
      addMovie(movie);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          Movie title

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={movie?.Response === 'False'
                ? 'input is-danger'
                : 'input'}
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          {movie?.Response === 'False'
          && (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
            >
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
