import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { IsValidUrl } from '../../utils/isValidUrl';

const placeholder = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(false);

    try {
      const data = await getMovie(query);

      if (Object.hasOwn(data, 'Error')) {
        const errorResponse = data as ResponseError;

        throw new Error(errorResponse.Error);
      }

      const movieData = data as MovieData;

      const imgUrl = IsValidUrl(movieData.Poster)
        ? movieData.Poster
        : placeholder;

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
      setLoading(false);
    }
  };

  const onAddMovie = () => {
    const isInList = movies.some((m) => m.imdbId === movie?.imdbId);

    if (!isInList && movie) {
      setMovies((prevMovies) => [...prevMovies, movie]);
    }

    setQuery('');
    setMovie(null);
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={(event) => {
                setError(false);
                setQuery(event.target.value);
              }}
            />
          </div>

          {error && !movie && (
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
                'is-loading': loading,
              })}
              disabled={
                !query || loading
              }
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
                onClick={onAddMovie}
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
          {
            movie && <MovieCard movie={movie} />
          }

        </div>
      )}
    </>
  );
};
