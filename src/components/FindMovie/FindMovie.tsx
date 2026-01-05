import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setError(null);
    setMovie(null);
    setLoading(true);

    try {
      const response = await getMovie(title.trim());

      if ('Response' in response && response.Response === 'False') {
        setError((response as ResponseError).Error);
        setMovie(null);
      } else {
        const movieData = response as MovieData;
        const convertedMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster && movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://placehold.co/360x270?text=no%20preview',
          imdbId: movieData.imdbID,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        };

        setMovie(convertedMovie);
        setError(null);
      }
    } catch (errorMessage) {
      setError('An unexpected error occurred');
      setMovie(null);
    } finally {
      setLoading(false);
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setError(null);
              }}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!title.trim() || loading}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie) {
                  onAddMovie(movie);
                  setMovie(null);
                  setTitle('');
                  setError(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
