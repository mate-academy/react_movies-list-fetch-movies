/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
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
  const [showMovie, setShowMovie] = useState(false);

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
        }
      })
      .finally();
  }, [query]);

  const clearForm = () => {
    setShowMovie(false);
    setMovie(null);
  };

  const handleChangeInput = (event: { target: { value: string; }; }) => {
    setQuery(event.target.value);
    clearForm();
  };

  const handleChangeAddButton = () => {
    clearForm();
    if (movie) {
      addMovie(movie);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setShowMovie(true);
          setQuery('');
        }}
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
          {!movie && showMovie && (
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
              className="button is-light"
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && showMovie && (
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
        <h2 className="title">Preview</h2>

        {showMovie && movie && (
          <MovieCard movie={movie} />
        )}

        {showMovie && !movie && (
          <div className="Loader">
            <div className="Loader__content" />
          </div>
        )}
      </div>
    </>
  );
};
