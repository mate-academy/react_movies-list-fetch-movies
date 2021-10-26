import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieSelected, selectMovie] = React.useState<Movie | null>(null);
  const [isSearchStarted, setIsSearchStarted] = useState(false);
  const [isSearchErrorOccured, setSearchErrorOccured] = useState(isSearchStarted && !movieSelected);
  const searchMovie = async (title: string) => {
    const movieFound = await findMovie(title);

    setIsSearchStarted(true);
    selectMovie(movieFound);
    setSearchErrorOccured(!movieSelected);
  };

  const onFormSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movieSelected) {
      addMovie(movieSelected);
      selectMovie(null);
      setSearchQuery('');
      setIsSearchStarted(false);
    }
  };

  useEffect(() => {
    setSearchErrorOccured(!movieSelected && isSearchStarted);
  }, [movieSelected]);

  return (
    <>
      <form
        onSubmit={onFormSubmit}
        className="find-movie"
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'input--is-danger': isSearchErrorOccured },
                )}
                required
                value={searchQuery}
                onChange={event => {
                  setSearchQuery(event.target.value);
                  setSearchErrorOccured(false);
                }}
              />
            </div>
          </label>

          {isSearchErrorOccured && (
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
              onClick={() => searchMovie(searchQuery)}
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
        <h2 className="title">Preview</h2>
        {movieSelected && <MovieCard movie={movieSelected} />}
      </div>
    </>
  );
};
