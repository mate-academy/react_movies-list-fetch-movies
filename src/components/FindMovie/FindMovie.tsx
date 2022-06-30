import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [titleQuery, setTitleQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [shouldDisplayError, setShouldDisplayError] = useState(false);

  const searchForMovie = async () => {
    const movie = await getMovie(titleQuery);

    setSelectedMovie(movie);

    if (!movie.imdbID) {
      setShouldDisplayError(true);
    }
  };

  const addMovie = () => {
    if (selectedMovie) {
      onAddMovie(selectedMovie);
      setTitleQuery('');
      setSelectedMovie(null);
      setShouldDisplayError(false);
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
              className="input"
              value={titleQuery}
              onChange={(event => {
                setTitleQuery(event.target.value);
                setShouldDisplayError(false);
              })}
            />
          </div>

          {(selectedMovie && shouldDisplayError)
            && (
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
              onClick={() => searchForMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">

        <h2 className="title">Preview</h2>
        {(selectedMovie && selectedMovie.imdbID && !shouldDisplayError)
          && (
            <MovieCard movie={selectedMovie} />
          )}
      </div>
    </>
  );
};
