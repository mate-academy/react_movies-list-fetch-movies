import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    onAdd(movie);
    setMovie(null);
    setTitle('');
    setHasError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={async event => {
          event.preventDefault();
          setIsLoading(true);

          try {
            const result = await getMovie(title.trim());

            if ('Error' in result) {
              setMovie(null);
              setHasError(true);

              return;
            }

            setHasError(false);
            setMovie({
              title: result.Title,
              description: result.Plot,
              imgUrl:
                result.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : result.Poster,
              imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
              imdbId: result.imdbID,
            });
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {' '}
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
              onChange={event => {
                setTitle(event.target.value);
                setHasError(false);
              }}
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
              disabled={!title.trim()}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
