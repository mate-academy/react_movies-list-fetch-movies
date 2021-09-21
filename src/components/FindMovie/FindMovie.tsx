import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovieByTitle } from '../../api';

type Props = {
  addMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [isCorrectTitle, setIsCorrectTitle] = useState(true);

  const findMovie = (async () => {
    const movieFromApi = await getMovieByTitle(title);

    if (movieFromApi?.imdbID) {
      setMovie(movieFromApi);
      setIsCorrectTitle(true);
      setTitle('');
    } else {
      setIsCorrectTitle(false);
      setMovie(null);
    }
  });

  const changeTitleForSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsCorrectTitle(true);
  };

  const addMovieToList = () => {
    addMovie(movie);
    setMovie(null);
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
              className="input is-danger"
              value={title}
              onChange={changeTitleForSearch}
            />
          </div>

          {!isCorrectTitle && (
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
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
              disabled={!movie}
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
            <MovieCard
              movie={movie}
            />
          </>
        )}
      </div>
    </>
  );
};
