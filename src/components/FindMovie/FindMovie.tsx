import React, { Dispatch, SetStateAction, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  movies: Movie[];
  error: boolean;
  loading: boolean;
  setMovies: Dispatch<SetStateAction<Movie[]>>;
  setError: (e: boolean) => void;
  setLoading: (e: boolean) => void;
}

export const FindMovie: React.FC<Props> = ({
  movies,
  error,
  loading,
  setMovies,
  setError,
  setLoading,
}) => {
  const [query, setGuery] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((result: MovieData | ResponseError) => {
        const movieData = result as MovieData;

        if (!movieData.Title) {
          setError(true);

          return;
        }

        const normalizedMovieData: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster === 'N/A' ? DEFAULT_IMG : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setMovie(normalizedMovieData);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleButtonClick = () => {
    setGuery(query);
    setButtonClicked(true);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGuery(event.target.value);
    setError(false);
  };

  const addMovie = (newMovie: Movie) => {
    const findMovie = movies.some(
      (film: Movie) => film.title === newMovie.title,
    );

    if (!findMovie) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }

    setGuery('');
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
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={handleQueryChange}
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
            {query ? (
              <button
                data-cy="searchButton"
                type="submit"
                className={cn('button', {
                  'is-light': loading === false,
                  'is-loading': loading === true,
                })}
                onClick={handleButtonClick}
              >
                {buttonClicked ? 'Search again' : 'Find a movie'}
              </button>
            ) : (
              <button
                disabled
                data-cy="searchButton"
                type="submit"
                className={cn('button', {
                  'is-light': loading === false,
                  'is-loading': loading === true,
                })}
                onClick={handleButtonClick}
              >
                {buttonClicked ? 'Search again' : 'Find a movie'}
              </button>
            )}
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
