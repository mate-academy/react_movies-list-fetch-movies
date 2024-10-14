import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';

type Props = {
  handleMovieAdd: (newMovie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ handleMovieAdd, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const foundMovieById = movies.find(mov => mov.imdbId === movie?.imdbId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    setTimeout(() => {
      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            setError(response.Error);
          } else {
            const foundMovie = {
              title: response.Title,
              description: response.Plot,
              imgUrl: response.Poster,
              imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
              imdbId: response.imdbID,
            };

            setMovie(foundMovie);
          }
        })
        .finally(() => setIsLoading(false));
    }, 300);
  };

  const onMovieAdd = (movieToAdd: Movie) => {
    if (!foundMovieById) {
      handleMovieAdd(movieToAdd);
    }

    setQuery('');
    setMovie(null);
  };

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
              value={query}
              onChange={event => setQuery(event.target.value.trimStart())}
              placeholder="Enter a title to search"
              className={`input ${error && 'is-danger'}`}
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
            {isLoading ? (
              <Loader />
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                disabled={!query}
              >
                {movie && query ? 'search again' : 'Find a movie'}
              </button>
            )}
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onMovieAdd(movie)}
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
