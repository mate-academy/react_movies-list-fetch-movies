import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';

type FindMovieProps = {
  addMovie: (mov: Movie) => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie>();
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function normalizeMovie(data: MovieData): Movie {
    return {
      title: data.Title,
      imgUrl: data.Poster !== 'N/A' ? data.Poster : '/default.jpg',
      description: data.Plot,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  function isMovieData(data: MovieData | ResponseError): data is MovieData {
    return 'Title' in data && 'Poster' in data;
  }

  function findMovie() {
    getMovie(query)
      .then(data => {
        if (isMovieData(data)) {
          setMovie(normalizeMovie(data));
          setHasError(false);
        } else {
          setHasError(true);
          setMovie(undefined);
        }
      })
      .catch(() => {
        setHasError(true);
        setMovie(undefined);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          findMovie();
          setIsLoading(true);
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
              className={!hasError ? 'input' : 'input is-danger'}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {hasError && (
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
              className={
                isLoading ? 'button is-light is-loading' : 'button is-light'
              }
              disabled={query ? false : true}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
