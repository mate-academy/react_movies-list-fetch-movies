import React, { useState, useRef } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const DEFAULT_POSTER = `https://via.placeholder.com/360x270.png?text=no%20preview`;

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setIsLoading(true);

    if (value.trim() === '') {
      setIsLoading(false);

      return;
    }

    try {
      const data = await getMovie(value);

      if ('Response' in data && data.Response === 'False') {
        setError((data as ResponseError).Error || 'Movie not found');
        setMovie(null);
      } else {
        const normalizedMovie: Movie = {
          title: (data as MovieData).Title || 'Unknown title',
          description: (data as MovieData).Plot || 'No description available.',
          imgUrl:
            (data as MovieData).Poster && (data as MovieData).Poster !== 'N/A'
              ? (data as MovieData).Poster
              : DEFAULT_POSTER,
          imdbUrl: (data as MovieData).imdbID
            ? `https://www.imdb.com/title/${(data as MovieData).imdbID}`
            : '#',
          imdbId: (data as MovieData).imdbID || '',
        };

        setMovie(normalizedMovie);
      }
    } catch (err) {
      setError('Failed to fetch movie data');
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    setMovies(prevMovies => {
      if (prevMovies.some(m => m.imdbId === movie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });

    setValue('');
    setMovie(null);
    inputRef.current?.focus();
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
              ref={inputRef}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={value.length === 0}
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
          <div className="movie-preview">
            <img
              data-cy="moviePoster"
              src={movie.imgUrl}
              alt={movie.title}
              onError={event => {
                const target = event.currentTarget as HTMLImageElement;

                target.src = DEFAULT_POSTER;
              }}
            />
            <h3 data-cy="movieTitle">{movie.title}</h3>
            <p data-cy="movieDescription">{movie.description}</p>
            {movie.imdbUrl !== '#' && (
              <a
                data-cy="movieURL"
                href={movie.imdbUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on IMDb
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};
