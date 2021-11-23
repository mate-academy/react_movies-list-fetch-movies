import React, { useState } from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
  movieAdded: boolean;
}

export const FindMovie: React.FC<Props> = ({ addMovie, movieAdded }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFound, setFound] = useState<boolean>(true);

  const isMovie = async () => {
    const result = await getMovie(movieTitle);

    if (result.Response === 'False') {
      setFound(false);
    }

    if (result.Response === 'True') {
      setFound(true);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovie(movieTitle);
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
                className="input is-danger"
                value={movieTitle}
                onChange={(event) => setMovieTitle(event.target.value)}
              />
            </div>
          </label>

          {!isFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={async () => {
                await isMovie();
                if (isFound) {
                  setMovie(await getMovie(movieTitle));
                }
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
                if (movie && isFound) {
                  addMovie(movie);
                }

                setMovieTitle('');
              }}
            >
              Add to the list
            </button>
            {movieAdded && (
              <p className="help is-danger">You already added this movie</p>
            )}
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isFound && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
