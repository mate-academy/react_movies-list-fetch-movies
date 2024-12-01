import React from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

const NOPOSTER = 'https://via.placeholder.com/360x270.png?text=no%20preview';
const IMDBBASEURL = 'https://www.imdb.com/title/';

interface Props {
  query: string;
  setQuery: (value: string) => void;
  isError: boolean;
  setIsError: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setMovie: (movie: Movie | null) => void
  movie: Movie | null;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  isError,
  setIsError,
  isLoading,
  setIsLoading,
  movie,
  setMovie,
  movies,
}) => {
  const handleFindMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Poster' in data) {
          setIsError(false);
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A' ? NOPOSTER : data.Poster,
            imdbUrl: IMDBBASEURL + data.imdbID,
            imdbId: data.imdbID,
          });
        } else {
          setIsError(true);
          setMovie(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addToMovieList = (film: Movie) => {
    if (movies.every(el => el.imdbId !== film.imdbId)) {
      movies.push(film);
      setMovie(null);
      setQuery('');
    }

    setMovie(null);
    setQuery('');
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              className={`input ${isError ? 'is-danger' : ''}`}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              onChange={handleQueryChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!query}
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
                onClick={() => addToMovieList(movie)}
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
