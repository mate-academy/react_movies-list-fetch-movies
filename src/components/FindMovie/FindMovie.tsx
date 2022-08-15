import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hanbleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const movie = await getMovie(query);

    if ('Error' in movie) {
      setError(true);
    } else {
      const newMovie = {
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster
          || 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: '',
        imdbId: movie.imdbID,
      };

      setSelectedMovie(newMovie);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={hanbleSubmit}
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
              onChange={(e) => {
                setQuery(e.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovie(selectedMovie);
                  setQuery('');
                  setSelectedMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
