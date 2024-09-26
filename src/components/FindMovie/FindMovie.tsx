import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[];
  setMovies: ((m: Movie[]) => void);
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const normalizeMovie = (movieData: MovieData): Movie => ({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieData.Poster,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setIsError(true);
          setMovie(null);
        } else {
          setMovie(normalizeMovie(response));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleOnChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isError) {
      setIsError(false);
    }

    setQuery(event.target.value);
  };

  const handleAddMovie = () => {
    if (movie) {
      if (!movies.some(mov => mov.imdbId === movie.imdbId)) {
        setMovies([...movies, movie]);
      }

      setQuery('');
      setMovie(null);
    }
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
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={handleOnChangeQuery}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={query.length === 0}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
