import React, { useEffect, useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void
};

export const FindMovie: React.FC<Props> = (props) => {
  const [findMovieByTitle, setMovieTitle] = useState('');
  const [isMovieFound, showMovie] = useState(false);
  const [isError, showError] = useState(false);
  const [findMovie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  useEffect(() => {
    showError(false);
  }, [findMovieByTitle]);

  const handleMovie = async () => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=51c89ae5&t=${findMovieByTitle}`);

    const movie = await response.json();

    if (movie.Response === 'False') {
      showError(true);
      showMovie(false);

      return null;
    }

    showError(false);
    showMovie(true);

    return {
      Poster: movie.Poster,
      Title: movie.Title,
      Plot: movie.Plot,
      imdbID: movie.imdbID,
    };
  };

  const handleFindMovie = async () => {
    const newMovie: Movie | null = await handleMovie();

    if (newMovie) {
      setMovie(newMovie);
    }
  };

  const handleAddMovie = () => {
    if (findMovie.Title.length) {
      props.addMovie(findMovie);
      setMovieTitle('');
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
              className={classNames('input', { 'is-success': !isError, 'is-danger': isError })}
              value={findMovieByTitle}
              onChange={(event) => setMovieTitle(event.target.value)}
            />
          </div>
          {isError && (
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
        {isMovieFound && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={findMovie} />
          </>
        )}
      </div>
    </>
  );
};
