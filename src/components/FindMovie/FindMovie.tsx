import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[];
  setMovies: (mov: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsloading] = useState(false);

  const normalizeMovieData = (movieData: MovieData): Movie => {
    return {
      imdbId: movieData.imdbID,
      title: movieData.Title,
      imgUrl:
        movieData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieData.Poster,
      description: movieData.Plot,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    };
  };

  const handleMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setIsloading(true);
    getMovie(query)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setError(true);
          setMovie(null);
        } else {
          setMovie(normalizeMovieData(response));
        }
      })
      .catch(() => {
        setError(true);
        setMovie(null);
      })
      .finally(() => setIsloading(false));
  };

  const handleAddToList = () => {
    if (movie) {
      const exists = movies.some((mov) => mov.imdbId === movie.imdbId);

      if (!exists) {
        setMovies([...movies, movie]);
      }

      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => handleMovie(e)}>
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
              onChange={(e) => {
                setQuery(e.target.value);
                setError(false);
              }}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Ca&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
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
                onClick={handleAddToList}
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
