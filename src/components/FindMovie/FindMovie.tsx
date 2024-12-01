import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  addMovie: (newMovie: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query.trim())
      .then(data => {
        if ('Error' in data) {
          setIsError(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = data;

          const selectedMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setNewMovie(selectedMovie);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovieBtn = () => {
    if (newMovie && !movies.find(movie => movie.imdbId === newMovie?.imdbId)) {
      addMovie([...movies, newMovie]);
    }

    setNewMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleFormSubmit(event)}
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
              className={classNames('input', { 'is-danger': isError })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              disabled={query.trim().length === 0}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieBtn}
              >
                Add to the list
              </button>
            </div>
          )}
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
