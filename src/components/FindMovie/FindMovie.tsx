import React, { Dispatch, useState } from 'react';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: Dispatch<Movie[]>;
};

export const FindMovie: React.FC<Props> = () => {
  const [title, setTitle] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const handleSearch = async () => {
    const movieFromServer = await getMovie(title);

    setSearchError(movieFromServer.Response === 'False');

    setCurrentMovie(movieFromServer);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setSearchError(false);
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
              value={title}
              onChange={handleInput}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleSearch}
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
        {(currentMovie && !searchError) && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={currentMovie} />
          </>
        )}
        {searchError && (
          <p>There is no movie with this name</p>
        )}
      </div>
    </>
  );
};
