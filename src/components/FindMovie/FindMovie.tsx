import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [movieFromServer, setMovieFromServer] = useState<Movie>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    if (isError) {
      setIsError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    getMovie(searchQuery.toLowerCase())
      .then(response => {
        if ('Error' in response) {
          setIsError(true);
        }

        if ('Title' in response) {
          setMovieFromServer({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddToList = () => {
    if (movieFromServer
      && !movies.some(movie => movie.imdbId === movieFromServer.imdbId)) {
      setMovies((prevMovies) => {
        return [...prevMovies, movieFromServer];
      });
    }

    setMovieFromServer(undefined);
    setSearchQuery('');
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
              className={classNames('input', { 'is-danger': isError })}
              value={searchQuery}
              onInput={handleInput}
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!searchQuery.length}
            >
              Find a movie
            </button>
          </div>

          {movieFromServer && (
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

      {movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
