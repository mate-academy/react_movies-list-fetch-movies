import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [query, setQuery] = useState(''); // що користувач вводить
  const [isLoading, setIsLoading] = useState(false); // стан завантаження
  const [error, setError] = useState(''); // повідомлення про помилку
  const [movie, setMovie] = useState<Movie | null>(null); // знайдений фільм

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(data.Error);
        } else {
          setError('');

          const posterUrl =
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster;

          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl: posterUrl,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    const isDuplicate = movies.some(m => m.imdbId === movie.imdbId);

    if (!isDuplicate) {
      onAdd(movie);
    }

    setQuery('');
    setMovie(null);
    setError('');
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
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setError('');
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
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
              disabled={query.trim().length === 0 ? true : false}
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                onClick={handleMovieAdd}
                data-cy="addButton"
                type="button"
                className="button is-primary"
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
