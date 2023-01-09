import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addNewMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const submitMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const newAddedMovie = (film: MovieData): Movie => {
      return {
        title: film.Title,
        description: film.Plot,
        imgUrl: (film.Poster === 'N/A')
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : film.Poster,
        imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
        imdbId: film.imdbID,
      };
    };

    const getQuery = async () => {
      try {
        const data = await getMovie(query);

        if ('imdbID' in data) {
          setMovie(newAddedMovie(data));
        } else {
          setHasError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    getQuery();
  };

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasError(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      addNewMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitMovie}>
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
              onChange={handleChangeQuery}
            />
          </div>
          {hasError && (
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
              disabled={!query}
              className={
                classNames('button is-light', { 'is-loading': loading })
              }
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
