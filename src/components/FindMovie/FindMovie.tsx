import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movieToAdd: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchError, setSearchError] = useState(false);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedMovie) {
      onAddMovie(selectedMovie);
    }

    setSelectedMovie(null);
    setSearchQuery('');
  };

  const findMovie = async () => {
    const movie = await getMovie(searchQuery);

    if (movie.Response === 'True') {
      setSelectedMovie({
        Title: movie.Title,
        Poster: movie.Poster,
        Plot: movie.Plot,
        imdbID: movie.imdbID,
        Response: movie.Response,
      });
    } else {
      setSearchError(true);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': searchError })}
                value={searchQuery}
                onChange={event => {
                  setSearchQuery(event.target.value);
                  setSearchError(false);
                }}
              />
            </div>
          </label>

          {searchError && (
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
              disabled={!selectedMovie}
              onClick={() => {
                if (selectedMovie !== null) {
                  onAddMovie(selectedMovie);
                  setSearchQuery('');
                  setSelectedMovie(null);
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
        {selectedMovie && <MovieCard movie={selectedMovie} />}
      </div>
    </>
  );
};
