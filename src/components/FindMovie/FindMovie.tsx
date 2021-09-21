import React, { useEffect, useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = (props) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [isMovieFound, showMovie] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    showMovie(true);
  }, [movieTitle]);

  const handleMovie = async () => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=51c89ae5&t=${movieTitle}`);

    const movieFromServer = await response.json();

    if (movieFromServer.Response === 'False') {
      showMovie(false);

      return null;
    }

    showMovie(true);

    return {
      Poster: movieFromServer.Poster,
      Title: movieFromServer.Title,
      Plot: movieFromServer.Plot,
      imdbID: movieFromServer.imdbID,
    };
  };

  const handleFindMovie = async () => {
    const newMovie: Movie | null = await handleMovie();

    if (newMovie) {
      setMovie(newMovie);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      props.addMovie(movie);
      setMovieTitle('');
      showMovie(true);
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
              className={classNames(
                'input',
                {
                  'is-success': isMovieFound,
                  'is-danger': !isMovieFound,
                },
              )}
              value={movieTitle}
              onChange={(event) => setMovieTitle(event.target.value)}
            />
          </div>
          {!isMovieFound && (
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
              onClick={() => handleFindMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => handleAddMovie()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
