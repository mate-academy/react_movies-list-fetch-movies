import React, { FormEvent, useState } from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    setHasError(false);
    setIsLoading(true);

    getMovie(title)
      .then(response => {
        if (response.Response === 'False') {
          setHasError(true);
          setMovie(null);

          return;
        }

        const normalizedMovie: Movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl:
            response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setMovie(normalizedMovie);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    onAdd(movie);
    setTitle('');
    setMovie(null);
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
              className={`input ${hasError ? 'is-danger' : ''}`}
              value={title}
              onChange={handleTitleChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
