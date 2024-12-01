import React, { useContext } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieContext } from '../../context/MovieContext';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

export const FindMovie: React.FC = () => {
  const {
    searchField,
    updateSearch,
    onSearchMovie,
    findMovie,
    findMovieError,
    findMovieLoading,
    onAddMovie,
    movies,
    onResetData,
  } = useContext(MovieContext);

  const disabled = searchField.length === 0;

  const onFindMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    onSearchMovie(searchField);
  };

  const updateMovieList = (currentMovie: Movie) => {
    const isSomeExist = movies.some(
      (movie) => movie.imdbId === findMovie?.imdbId,
    );

    if (!isSomeExist) {
      onAddMovie(currentMovie);
    }

    onResetData();
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': findMovieError,
              })}
              value={searchField}
              onChange={(event) => updateSearch(event.target.value)}
            />
          </div>

          {findMovieError && (
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
              className={classNames({
                'button is-light': !findMovieLoading,
                'button is-loading': findMovieLoading,
              })}
              disabled={disabled}
              onClick={(event) => onFindMovie(event)}
            >
              {`${findMovie ? 'Search again' : 'Find a movie'}`}
            </button>
          </div>

          {findMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => updateMovieList(findMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {findMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
