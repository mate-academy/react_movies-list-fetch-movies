import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from './api';

type Props = {
  addNewMovie: (newMovie: Movie | null) => void;
};

export const FindMovie: React.FC <Props> = ({ addNewMovie }) => {
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const [
    isErrorOccurred,
    setIsErrorOccurred,
  ] = useState(false);

  const [
    loadedMovie,
    setLoadedMovie,
  ] = useState(null);

  const handleSearchButtonClick = async () => {
    try {
      const currentMovie = await getMovie(searchQuery);

      setLoadedMovie(currentMovie);

      setIsErrorOccurred(false);

      return currentMovie;
    } catch (error) {
      setIsErrorOccurred(true);

      return error;
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
              value={searchQuery}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={
                (event) => setSearchQuery(event.target.value)
              }
            />
          </div>

          {
            (isErrorOccurred && searchQuery)
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                handleSearchButtonClick();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addNewMovie(loadedMovie);
                setSearchQuery('');
                setLoadedMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          loadedMovie
          && (
            (!isErrorOccurred && loadedMovie)
            && (
              <MovieCard movie={loadedMovie} />
            )
          )
        }
      </div>
    </>
  );
};
