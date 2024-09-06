import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import cn from 'classnames';

type Props = {
  addMovieToList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [query, setQuery] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(movieData => {
        if ('Error' in movieData) {
          setErrorMessage(true);
          setQuery('');
        } else {
          const newMovie = {
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : movieData.Poster,
            imdbUrl: 'https://www.imdb.com/title/' + movieData.imdbID,
            imdbId: movieData.imdbID,
          };

          setFoundMovie(newMovie);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleTitleMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddToTheList = () => {
    if (foundMovie) {
      addMovieToList(foundMovie);
      setQuery('');
      setErrorMessage(false);
      setFoundMovie(null);
    }
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
              className={cn('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={handleTitleMovie}
            />
          </div>

          {errorMessage && (
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
              disabled={!query.trim()}
              className={cn('button is-light', {
                'is-loading': loading,
              })}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {foundMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={foundMovie} />
          </>
        )}
      </div>
    </>
  );
};
