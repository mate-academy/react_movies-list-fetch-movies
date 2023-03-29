import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setError] = useState(false);

  const normilizedData = (movieOnQuery: MovieData | ResponseError) => {
    if ('Error' in movieOnQuery) {
      setError(true);

      return;
    }

    const createMovie = {
      title: movieOnQuery.Title,
      description: movieOnQuery.Plot,
      imgUrl: movieOnQuery.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieOnQuery.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieOnQuery.imdbID}`,
      imdbId: movieOnQuery.imdbID,
    };

    setMovie(createMovie);
  };

  const searchMovie = async (search: string) => {
    try {
      setLoading(true);
      const data = await getMovie(search);

      normilizedData(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchMovie(query);
  };

  const handleAddMovie = (selectedMovie: Movie) => {
    addMovie(selectedMovie);
    setMovie(null);
    setQuery('');
  };

  const handleChange = (search: string) => {
    setQuery(search);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={query}
              placeholder="Enter a title to search"
              className="input is-dander"
              onChange={({ target }) => handleChange(target.value)}
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
              disabled={!query.trim()}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
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
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            )}
          </div>
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
