import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  addMovie: () => void;
  newMovie: Movie | null;
  setNewMovie: (value: Movie | null) => void;
};

class CustomMovie implements Movie {
  title: string;

  description: string;

  imgUrl: string;

  imdbUrl: string;

  imdbId: string;

  constructor(movieData: MovieData) {
    this.title = movieData.Title;
    this.description = movieData.Plot;
    this.imgUrl = movieData.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : movieData.Poster;
    this.imdbUrl = `https://www.imdb.com/title/${movieData.imdbID}`;
    this.imdbId = movieData.imdbID;
  }
}

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  addMovie,
  newMovie,
  setNewMovie,
}) => {
  const [responseError, setResponseError] = useState(false);
  const [initSearch, setInitSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInitSearch(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setResponseError(true);
        } else {
          setNewMovie(new CustomMovie(response));
        }
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponseError(false);
    setQuery(e.target.value);
  };

  useEffect(() => {
    setInitSearch(false);
  }, [newMovie, query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className="input is-dander"
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {responseError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': initSearch && !responseError },
              )}
              disabled={!query}
            >
              {!newMovie ? 'Find a movie' : 'Search Again'}
            </button>
          </div>

          <div className="control">
            {newMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
