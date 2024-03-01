import cn from 'classnames';
import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

function convertData(data: MovieData | null): Movie | null {
  if (data) {
    return {
      title: data.Title,
      description: data.Plot,
      imgUrl:
        data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  return null;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [error, setError] = useState(false);

  const normalizedMovie = convertData(movie);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
  };

  const handleFindMovieButton = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then(response => {
        if ((response as ResponseError).Error) {
          setError(true);
        } else {
          setMovie(response as MovieData);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddButton = () => {
    setQuery('');
    setError(false);
    setLoading(false);
    setMovie(null);
    addMovie(normalizedMovie as Movie);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovieButton}>
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
              onChange={handleQueryChange}
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
              disabled={!query}
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
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {normalizedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={normalizedMovie} />
        </div>
      )}
    </>
  );
};
