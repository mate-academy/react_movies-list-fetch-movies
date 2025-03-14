import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (el: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const repetitionMovie = (el: MovieData): Movie => {
    return {
      title: el.Title,
      imdbId: el.imdbID,
      description: el.Plot,
      imgUrl:
        el.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : el.Poster,
      imdbUrl: `https://www.imdb.com/title/${el.imdbID}`,
    };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await getMovie(query);

      if ('Error' in result) {
        setError(true);
        setMovie(null);
      } else {
        setMovie(repetitionMovie(result));
      }
    } catch (er) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onAddFilm = () => {
    const isAdd = movies.find(el => el.imdbId === movie?.imdbId);

    if (!isAdd && movie) {
      onAdd(movie);
      setMovie(null);
      setQuery('');
    } else {
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {!error && !loading && movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddFilm}
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
