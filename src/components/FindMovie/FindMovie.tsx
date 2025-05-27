import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setMovie(null);
      setError('Can`t find a movie with such a title');

      return;
    }

    setIsLoading(true);

    getMovie(trimmed)
      .then((result: MovieData | ResponseError) => {
        if ('Response' in result && result.Response === 'False') {
          setMovie(null);
          setError('Can`t find a movie with such a title');
        } else {
          const data = result as MovieData;

          setMovie({
            imdbId: data.imdbID,
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (movie) {
      onAdd(movie);
      setTitle('');
      setMovie(null);
      setError('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
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
              disabled={!title}
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
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
                onClick={handleAdd}
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
