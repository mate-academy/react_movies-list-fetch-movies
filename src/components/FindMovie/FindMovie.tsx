import React from 'react';
import './FindMovie.scss';

import { MovieContext } from '../../context/movieContext';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const {
    query,
    movieIsFound,
    movieData,
    hasError,
    isLoading,
    handleAddToList,
    handleSearch,
    submitSearch,
  } = React.useContext(MovieContext);

  let movie = null;

  if (movieData) {
    const { Title, Plot, Poster, imdbID } = movieData;
    let finalPoster = Poster;

    if (Poster === 'N/A') {
      finalPoster = 'https://via.placeholder.com/360x270.png?text=no%20preview';
    }

    movie = {
      title: Title,
      description: Plot,
      imgUrl: finalPoster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              onChange={event => handleSearch(event)}
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${hasError && 'is-danger'}`}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={query.length === 0}
              onClick={event => {
                event.preventDefault();
                submitSearch();
              }}
              className={`button ${isLoading ? 'is-loading' : 'is-light'}`}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                onClick={() => {
                  handleAddToList(movie);
                }}
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieIsFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
