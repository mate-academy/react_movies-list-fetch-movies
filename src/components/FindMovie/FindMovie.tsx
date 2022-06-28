import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  onSetMovies: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, onSetMovies }) => {
  const defaultMovie = {
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  };

  const [selectedMovie, setSelectedMovie] = useState<Movie>(defaultMovie);
  const [showMovie, setShowMovie] = useState(false);
  const [query, setQuery] = useState('');

  const loadMovie = async () => {
    const loadedMovie = await getMovie(query);

    setSelectedMovie(loadedMovie);
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
              onChange={(event) => setQuery(event.target.value)}
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
              data-cy="find"
              onClick={() => {
                loadMovie();
                setShowMovie(true);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                if (movies.every(
                  movie => movie.imdbID !== selectedMovie.imdbID,
                )) {
                  onSetMovies(selectedMovie);
                  setQuery('');
                  setShowMovie(false);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {showMovie && (
          <MovieCard movie={selectedMovie} />)}
      </div>
    </>
  );
};
