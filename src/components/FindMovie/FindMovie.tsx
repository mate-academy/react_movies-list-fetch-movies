import React, { useRef, useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

const DEFAULT_POSTER = `https://via.placeholder.com/360x270.png?text=no%20preview`;

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(false);
    setIsLoading(true);

    if (value.trim() === '') {
      return;
    }

    try {
      const data = await getMovie(value);

      if ('Response' in data && data.Response == 'False') {
        setError(true);
        setIsLoading(false);
      } else {
        setError(false);
        setIsLoading(false);

        const normalizedMovie: Movie = {
          title: (data as MovieData).Title,
          description: (data as MovieData).Plot,
          imgUrl:
            (data as MovieData).Poster !== 'N/A'
              ? (data as MovieData).Poster
              : DEFAULT_POSTER,
          imdbUrl: `https://www.imdb.com/title/${(data as MovieData).imdbID}`,
          imdbId: (data as MovieData).imdbID,
        };

        setMovie(normalizedMovie);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    setValue('');
    setMovie(null);
    if (!movie) {
      return;
    }

    setMovies(prev => {
      if (prev.some(m => m.imdbId === movie?.imdbId)) {
        return prev;
      }

      return [...prev, movie];
    });

    inputRef?.current?.focus();
  };

  return (
    <>
      <form className="find-movie">
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
              className={`input ${error ? 'is-danger' : ''} `}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                setError(false);
              }}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={value.length === 0}
              onClick={handleSubmit}
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
                onClick={handleAddMovie}
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
