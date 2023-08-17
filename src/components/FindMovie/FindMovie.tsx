import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError(false);

    try {
      const applyQuery = query.trim().toLowerCase();
      const data = await getMovie(applyQuery);

      if (Object.hasOwn(data, 'Error')) {
        const errorResponse = data as ResponseError;

        throw new Error(errorResponse.Error);
      }

      const movieData = data as MovieData;

      const imgUrl = movieData.Poster !== 'N/A'
        ? movieData.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview';

      const imdbUrl = `https://www.imdb.com/title/${movieData.imdbID}`;

      const preview = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl,
        imdbUrl,
        imdbId: movieData.imdbID,
      };

      setMovie(preview);
    } catch (e) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
    setMovie(null);
  };

  const handleAddMovie = () => {
    const matchedMovie = movies.some(findM => findM.imdbId === movie?.imdbId);

    if (!matchedMovie && movie) {
      setMovies((movieList) => [
        ...movieList,
        movie,
      ]);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {(!movie && error) && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={
                !query || isLoading
              }
              onClick={handleSubmit}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}

          </div>
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
