import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import cn from 'classnames';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleMovieSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(data => {
        // API may return an error object with Response: 'False'
        if ((data as ResponseError).Response === 'False') {
          setMovieData(null);
          setErrorMessage(
            (data as ResponseError).Error ||
              "Can't find a movie with such a title",
          );
        } else {
          setMovieData(data as MovieData);
          setErrorMessage(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (movieData) {
      const foundMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster !== 'N/A'
            ? movieData.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovie(foundMovie);
    }
  }, [movieData]);

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);

      setMovie(null);
      setMovieData(null);
      setQuery('');
      setErrorMessage(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleMovieSearch}>
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
                'is-danger': errorMessage,
                'is-loading': isLoading,
              })}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setQuery(event.target.value);
                setErrorMessage(null);
              }}
              value={query}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}

            >
              Find a movie
            </button>
          </div>

          {movieData && !errorMessage && (
            <div className="control">
              <button
                disabled={!movieData}
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

      {movieData && !errorMessage && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
