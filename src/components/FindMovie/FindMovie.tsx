import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { normalizeMovie } from '../../types/normalizeMovie';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [searchInputMovie, setSearchInputMovie] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movieIsFound, setMovieIsFound] = useState(false);


  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputMovie(event.target.value);
    setIsError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMovieTitle(searchInputMovie.trim());
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    const isDuplicate = movies.some(m => m.imdbId === movie?.imdbId);

    if (isDuplicate) {
      setSearchInputMovie('');
      setMovieTitle('');
      setMovie(null);
      setMovieIsFound(false);

      return;
    }

    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setSearchInputMovie('');
      setMovieTitle('');
      setMovieIsFound(false);
    }
  };

  useEffect(() => {
    if (!movieTitle) {
      return;
    }

    const loadMovie = async () => {
      try {
        setIsLoadingMovie(true);
        const result = await getMovie(movieTitle);

        if ('Error' in result) {
          setMovie(null);
          setIsError(true);
        } else {
          const normalized = normalizeMovie(result);

          setMovie(normalized);
          setIsError(false);
          setMovieIsFound(true);
        }
      } catch {
        setMovie(null);
        setIsError(true);
      } finally {
        setIsLoadingMovie(false);
      }
    };

    loadMovie();
  }, [movieTitle]);

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
              className={`input ${isError ? 'is-danger' : ''}`}
              value={searchInputMovie}
              onChange={handleInput}
            />
          </div>

          {isError && (
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
              className={`button is-light ${isLoadingMovie ? 'is-loading' : ''}`}
              disabled={!searchInputMovie.trim()}
            >
              Find a movie
            </button>
          </div>

          {movieIsFound && !isLoadingMovie && (
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
