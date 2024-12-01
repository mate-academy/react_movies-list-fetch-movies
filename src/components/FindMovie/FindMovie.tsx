import React, { ChangeEvent, useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (...args: any[]) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args[0]);
    }, delay);
  };
}

type Props = {
  query: string,
  setQuery: React.Dispatch<React.SetStateAction<string>>,
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
};

export const FindMovie: React.FC<Props> = ({
  query, setQuery, movies, setMovies,
}) => {
  const appliedQuery = useCallback(debounce(setQuery, 0), []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movie, setMovie] = useState<Movie | undefined>();

  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    appliedQuery(event.target.value);
    setIsLoading(false);
    setInputValue(event.target.value);
    setErrorMessage('');
  };

  function isMovieData(obj: any): obj is MovieData {
    return (
      obj
      && typeof obj === 'object'
      && 'Title' in obj
      && 'Plot' in obj
      && 'Poster' in obj
      && 'imdbID' in obj
    );
  }

  const findMovie = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      setErrorMessage('Please enter a title to search');

      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const newMovie = await getMovie(query);

      if (isMovieData(newMovie)) {
        // Створення нового об'єкта типу Movie на основі властивостей newMovie
        const movieData: Movie = {
          title: newMovie.Title,
          description: newMovie.Plot,
          imgUrl: newMovie.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : newMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
          imdbId: newMovie.imdbID,
        };

        setMovie(movieData);
      } else {
        setIsLoading(false);
        setErrorMessage('Can\'t find a movie with such a title');
      }
    } catch (error) {
      setErrorMessage('An error occurred while receiving data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlerSetMovie = () => {
    const duplicates = movies.filter(mov => {
      const currMovie = movie as Movie;

      return mov.imdbId === currMovie.imdbId;
    });

    if (duplicates.length === 0) {
      setMovies([
        movie as Movie,
        ...movies,
      ]);
    }

    setMovie(undefined);
    setQuery('');
    setInputValue('');
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
              className={`${errorMessage && 'is-danger'} input`}
              onChange={handleInputChange}
              value={inputValue}
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
              data-cy="searchButton"
              type="submit"
              className={`${isLoading && 'is-loading'} button is-light`}
              disabled={query.length === 0}
              onClick={findMovie}
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
                onClick={handlerSetMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie !== undefined && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
