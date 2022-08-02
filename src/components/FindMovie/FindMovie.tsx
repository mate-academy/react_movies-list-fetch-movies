/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState(false);
  const [showMovie, setShowMovie] = useState(false);
  const [foundMovie, setFoundMovie] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    getMovie(query)
      .then(movieFromServer => {
        if ('Title' in movieFromServer) {
          const newMovie = {
            title: movieFromServer.Title,
            description: movieFromServer.Plot,
            imgUrl: movieFromServer.Poster !== 'N/A' ? (
              movieFromServer.Poster
            ) : (
              'https://via.placeholder.com/360x270.png?text=no%20preview'
            ),
            imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
            imdbId: movieFromServer.imdbID,
          };

          setMovie(newMovie);
        } else {
          setFoundMovie(false);
        }

        setShowLoader(false);
        setSearch(false);
      })
      .finally();
  }, [search]);

  const clearForm = () => {
    setQuery('');
    setShowMovie(false);
    setMovie(null);
  };

  const handleChangeInput = (event: { target: { value: string; }; }) => {
    setQuery(event.target.value);
    setFoundMovie(true);
  };

  const handleChangeAddButton = () => {
    clearForm();
    if (movie) {
      addMovie(movie);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setShowMovie(true);
    setShowLoader(true);
    setSearch(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-dander"
              value={query}
              onChange={handleChangeInput}
            />
          </div>
          {!foundMovie && showMovie && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            {!showMovie ? (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                disabled={!query}
              >
                Find a movie
              </button>
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className={classNames(
                  'button is-light',
                  { 'is-loading': showLoader },
                )}
              >
                Search again
              </button>
            )}
          </div>

          {foundMovie && showMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleChangeAddButton}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {showMovie && movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
