import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [errorThroughSearch, setErrorThroughSearch] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loader, setLoader] = useState(false);

  const textOfSubmitButton = movie
    ? 'Search again'
    : 'Find a movie';

  function handleSetSearchText(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setSearchText(event.target.value);
    setErrorThroughSearch(false);
  }

  const addMovieToList = () => {
    addMovie(movie as Movie);
    setMovie(null);
    setSearchText('');
  };

  const findMovie = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    setLoader(true);
    event.preventDefault();

    try {
      const query: string = searchText.trim();
      const response: Movie = await getMovie(query);

      setMovie(response);
    } catch (e) {
      setErrorThroughSearch(true);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
      >
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
              value={searchText}
              onChange={handleSetSearchText}
              className={classNames('input', {
                'is-danger': errorThroughSearch,
              })}
            />
          </div>

          {errorThroughSearch && (
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
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
              disabled={!searchText}
            >
              {textOfSubmitButton}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
