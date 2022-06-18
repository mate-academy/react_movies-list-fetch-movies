import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../react-app-env';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

const getMovie = async (query: string) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=27284918&t=${query}`);

  return response.json();
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    const movieFromServer = await getMovie(query);

    setNotFound(movieFromServer.Response === 'False');

    setMovie(movieFromServer);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setNotFound(false);
  };

  const handleSummit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!notFound && movie) {
      addMovie(movie);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSummit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={query}
              onChange={handleQuery}
            />
          </div>

          {notFound && (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && movie.Response === 'True' && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
        {notFound && 'Movie not found'}

      </div>
    </>
  );
};
