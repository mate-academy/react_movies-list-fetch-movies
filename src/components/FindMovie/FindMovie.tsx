import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { movies } from '../../api/movies';

interface Props {
  addMovie: (newMovieApi: MovieApi) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [findMovie, setfindMovie] = useState('');
  const [movieFromIMDB, setMovieFromIMDB] = useState<MovieApi | null>(null);
  const [movieAvailable, setMovieAvailable] = useState(true);

  const moviesByTitle = async () => {
    const newMovie: Movie = await movies(findMovie);

    if (newMovie.Response === 'False') {
      setMovieFromIMDB(null);
      setMovieAvailable(false);
    } else {
      const newMovieApi: MovieApi = {
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster,
        imdbId: newMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
      };

      setMovieFromIMDB(newMovieApi);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieAvailable(true);
    setfindMovie(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    addMovie(movieFromIMDB as MovieApi);
    setfindMovie('');
    setMovieFromIMDB(null);
    setMovieAvailable(true);
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
                id="movie-title"
                name="title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': !movieAvailable },
                )}
                value={findMovie}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          {!movieAvailable && (
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
              onClick={moviesByTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movieFromIMDB}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movieFromIMDB && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              movie={movieFromIMDB}
            />
          </>
        )}
      </div>
    </>
  );
};
