import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  moviesList: Movie[];
  onMovieAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ moviesList, onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const newMovieConstructor = (data: MovieData) => {
    const {
      Poster,
      Title,
      Plot,
      imdbID,
    } = data;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError(false);
    setNewMovie(null);

    getMovie(query.trim())
      .then(data => {
        if ('Error' in data) {
          setError(true);
        } else {
          const movieToAdd = newMovieConstructor(data);

          setNewMovie(movieToAdd);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovieButton = () => {
    const isAlreadyInList = moviesList
      .find(movie => movie.imdbId === newMovie?.imdbId);

    if (newMovie) {
      if (!isAlreadyInList) {
        onMovieAdd(newMovie);
        setNewMovie(null);
        setQuery('');
      } else {
        setNewMovie(null);
        setQuery('');
      }
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleFormSubmit(event)}
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
              className={cn('input', { 'is-danger': error })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={query.trim().length === 0}
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
                onClick={handleAddMovieButton}
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
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
