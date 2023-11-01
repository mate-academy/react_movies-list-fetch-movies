import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { ALTERNATIVE_IMG_URL, getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (movies: Movie[]) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({
  setMovies,
  movies,
}) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [noMovieError, setNoMovieError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query).then(movie => {
      setIsLoading(false);
      if ('imdbID' in movie) {
        const newMovieToShow: Movie = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster === 'N/A' ? ALTERNATIVE_IMG_URL : movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        };

        setNewMovie(newMovieToShow);
      } else {
        setNoMovieError(true);
      }
    });
  };

  const handleMovieList = (newMovieToAdd: Movie) => {
    if (!movies.some(movie => movie.imdbId === newMovieToAdd.imdbId)) {
      setMovies([...movies, newMovieToAdd]);
    }

    setQuery('');
    setNewMovie(null);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setNoMovieError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleNewMovie}>
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
              className={cn('input', {
                'is-danger': noMovieError,
              })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {noMovieError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                onClick={() => handleMovieList(newMovie)}
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
