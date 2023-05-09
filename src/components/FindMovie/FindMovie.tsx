/* eslint-disable max-len */
import React, { useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[] | null
  setMovies: (movies: Movie[]) => void
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [selectedMovie, selectMovie] = useState<Movie | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const convertMovieFormat = ({
    Title,
    Plot,
    Poster,
    imdbID,
  }: MovieData) => ({
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  });

  const findMovie = async (inputQuery: string) => {
    try {
      await getMovie(inputQuery)
        .then(response => {
          if ('Error' in response) {
            return Promise.reject();
          }

          const movie = convertMovieFormat(response);

          return selectMovie(movie);
        });
    } catch {
      setNotFound(true);
    }
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    findMovie(query)
      .finally(() => setIsLoading(false));
  };

  const addMovie = () => {
    const isDuplicate = movies?.some(movie => movie.imdbId === selectedMovie?.imdbId);

    if (movies && selectedMovie && !isDuplicate) {
      setMovies([...movies, selectedMovie]);
    }

    selectMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => submitHandler(event)}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setNotFound(false);
              }}
            />
          </div>

          {notFound && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!selectedMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {selectedMovie && (
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

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
