import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movie: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>();

  const changeType = (data: MovieData) => ({
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  });

  const handleChaneQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleForm = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if ('Error' in data) {
          setIsError(true);

          return;
        }

        setNewMovie(changeType(data));
        setIsError(false);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAdd = () => {
    const uniq = movies.every(movie => movie.imdbId !== newMovie?.imdbId);

    if (newMovie && uniq) {
      setMovies([...movies, newMovie]);
    }

    setQuery('');
    setNewMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleForm}>
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
              className={cn('input', { 'is-danger': isError })}
              value={query}
              onChange={handleChaneQuery}
            />
          </div>

          {isError && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {<MovieCard movie={newMovie} />}
        </div>
      )}
    </>
  );
};
