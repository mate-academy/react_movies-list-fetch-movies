import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAdd: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setIsError(true);

          return;
        }

        const movieData = data as MovieData;

        setPreviewMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const addMovie = () => {
    setIsError(false);
    setQuery('');
    setPreviewMovie(null);
    const movieToAdd = previewMovie as Movie;

    if (movies.find(movie => movie.imdbId === movieToAdd.imdbId)) {
      return;
    }

    onAdd([...movies, movieToAdd]);
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
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsError(false);
              }}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {!isLoading && previewMovie && (
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

      {!isLoading && previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
