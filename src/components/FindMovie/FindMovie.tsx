import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type FindMovieProps = {
  onAddMovie: (movie: Movie) => void;
};

const DEFAULT_URL = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const isResponseError = (
    response: MovieData | ResponseError,
  ): response is ResponseError => {
    return (response as ResponseError).Response === 'False';
  };

  const getMovieFromServer = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const movieFromServer: MovieData | ResponseError = await getMovie(query);

      if (isResponseError(movieFromServer)) {
        setError(true);
        setMovie(null);

        return;
      }

      const movieUrl =
        movieFromServer.Poster === 'N/A' ? DEFAULT_URL : movieFromServer.Poster;

      setMovie({
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieUrl,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (movie) {
      setQuery('');
      onAddMovie(movie);
      setMovie(null);
    }
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
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={handleChangeQuery}
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
              className={cn('button is-light', { 'is-loading': loading })}
              onClick={getMovieFromServer}
              disabled={!query}
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
                onClick={handleSubmit}
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
