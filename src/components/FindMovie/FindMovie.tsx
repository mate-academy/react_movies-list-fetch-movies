import React, { useState } from 'react';
import { getMovie } from '../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieFind, setFindCheck] = useState(true);

  const searchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
  };

  const movieFind = async () => {
    try {
      const movieFromServer = await getMovie(searchTitle);

      setMovie(movieFromServer);

      if (movieFromServer.Response === 'False') {
        setFindCheck(false);
        setMovie(null);
      }
    } catch {
      throw new Error();
    }
  };

  const addMovieToList = (movieToList: Movie) => {
    if (movieToList) {
      addMovie(movieToList);
      setMovie(null);
    }

    setSearchTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={searchTitle}
              onChange={searchInput}
              className={`input ${!isMovieFind ? 'is-danger' : ''}`}
            />
          </label>

          {!isMovieFind && (
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
              onClick={movieFind}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => movie && addMovieToList(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && <h2 className="title">Preview</h2>}
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
