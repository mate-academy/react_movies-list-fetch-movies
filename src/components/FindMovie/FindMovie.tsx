import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard/MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';

type Props = {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  addMovie
}) => {
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);


  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  }

  const handleAddMovie = () => {
    setQuery('');
    addMovie(newMovie as Movie);
    setNewMovie(null)
  }

  const handleDownloadMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query.trimEnd()).then((response) => {
      const {
        Plot, Poster, Title, imdbID,
      } = response as MovieData;

      if ('Error' in response) {
        setHasError(true);
      } else {
        setNewMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      }
    })
    .catch(() => setHasError(true))
    .finally(() =>
      setIsLoading(false)
    )
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleDownloadMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={(event) => handleQueryChange(event)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {'is-danger': hasError})}
            />
          </div>

          {hasError &&
          <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {'is-loading': isLoading})}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {newMovie && <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {newMovie !== null && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
