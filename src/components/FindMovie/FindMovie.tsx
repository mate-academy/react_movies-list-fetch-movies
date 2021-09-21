import React, { useState } from 'react';
import './FindMovie.scss';
import { loadData } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { onAdd } = props;

  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState(true);

  const addQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsCorrect(true);
  };

  const unpackMovies = async () => {
    const movieFromServer: Movie = await loadData(query);

    if (movieFromServer.Response === 'False') {
      setNewMovie(null);
      setIsCorrect(false);

      return;
    }

    setNewMovie({
      Title: movieFromServer.Title,
      Plot: movieFromServer.Plot,
      Poster: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}/`,
      imdbID: movieFromServer.imdbID,
    });

    setQuery('');
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
              value={query}
              onChange={addQuery}
            />
          </div>

          {isCorrect
            || (
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
              onClick={unpackMovies}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!newMovie}
              onClick={() => {
                onAdd(newMovie as Movie);
                setNewMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie
          && <MovieCard newMovie={newMovie} />}
      </div>
    </>
  );
};
