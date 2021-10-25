import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { findMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, selectMovie] = React.useState<Movie | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchError, setSearchError] = useState(isSearchLoading && !selectedMovie);

  const searchMovie = async (title: string) => {
    const foundMovie = await findMovie(title);

    setIsSearchLoading(true);
    selectMovie(foundMovie);
    setSearchError(!selectedMovie);
  };

  const submitForm: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (selectedMovie) {
      addMovie(selectedMovie);

      selectMovie(null);
      setSearchQuery('');
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    setSearchError(!selectedMovie && isSearchLoading);
  }, [selectedMovie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                required
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': isSearchError },
                )}
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
            </div>
          </label>

          {isSearchError && (
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
              onClick={() => {
                searchMovie(searchQuery);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!selectedMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {selectedMovie && <MovieCard movie={selectedMovie} />}
        {!isSearchLoading && (<div>Start search</div>)}
      </div>
    </>
  );
};
