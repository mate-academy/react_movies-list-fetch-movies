import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  getNewMovie: (movie: Movie) => void;
  foundMovie: Movie;
  setFoundMovie: (movie: Movie) => void;
  emptyMovie: Movie;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  getNewMovie,
  foundMovie,
  setFoundMovie,
  emptyMovie,
}) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const handleMovieTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const searchMovie = (event: React.SyntheticEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setErrorMessage('Can&apos;t find a movie with such a title');
        } else {
          setCount(1);
          setFoundMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const findSameMovies = movies.some(
    movie => movie.imdbId === foundMovie.imdbId,
  );

  const addMovie = () => {
    if (findSameMovies) {
      setQuery('');
      setFoundMovie(emptyMovie);
    } else {
      setQuery('');
      getNewMovie(foundMovie);
      setFoundMovie(emptyMovie);
      setCount(0);
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
              value={query}
              onChange={handleMovieTitle}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {errorMessage}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-Loading': isLoading,
              })}
              onClick={searchMovie}
              disabled={!query}
            >
              {count === 1 ? 'Search again' : 'Find a movie'}
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
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
