import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  foundMovie: Movie;
  setFoundMovie: (movie: Movie) => void;
  cleanMovie: Movie;
  getNewMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  setFoundMovie,
  cleanMovie,
  foundMovie,
  getNewMovie,
  movies,
}) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const setMovieTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const searchMovie = (event: React.SyntheticEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if (!('Error' in data)) {
          setFoundMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        } else {
          setErrorMessage(`Can't find a movie with such a title`);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const sameMovie = movies.some(movie => foundMovie.imdbId === movie.imdbId);

  const addMovie = () => {
    if (sameMovie) {
      setQuery('');
      setFoundMovie(cleanMovie);
    } else {
      setQuery('');
      setFoundMovie(cleanMovie);
      getNewMovie(foundMovie);
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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              onChange={setMovieTitle}
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
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              onClick={searchMovie}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {foundMovie.imdbId && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie.imdbId && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {foundMovie.imdbId && <MovieCard movie={foundMovie} />}
        </div>
      )}
    </>
  );
};
