import React, { useState } from 'react';
import './FindMovie.scss';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMovie = (mov: Movie) => {
    if (!movies.find(a => a.imdbId === movie?.imdbId)) {
      onMovies(prev => [...prev, mov]);
    }

    setMovie(null);
    setError('');
    setQuery('');
  };

  const handleSearch = (name: string) => {
    setLoading(true);

    getMovie(name)
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          const valid: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : response.Poster,
            imdbUrl: 'https://www.imdb.com/title/' + response.imdbID,
            imdbId: response.imdbID,
          };

          setError('');
          setMovie(valid);
        } else {
          setError("Can't find a movie with such a title");
        }

        return response;
      })
      .finally(() => setLoading(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError('');
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(query);
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={query === ''}
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
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
