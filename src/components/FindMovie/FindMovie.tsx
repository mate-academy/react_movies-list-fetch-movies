/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { isResponseError } from '../../_utils/isResponseError';
import { normalizeMovieData } from '../../_utils/normalizeMovieData';

interface FindMovieProps {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<FindMovieProps> = ({ movies, setMovies }) => {
  const [currentSearchTerm, setSearchTerm] = useState<string>('');
  const [currentSearchCount, setSearchCount] = useState(0);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFind = async () => {
    console.log('searching with term', currentSearchTerm);
    setLoading(true);
    setSearchCount(prevCount => prevCount + 1);

    try {
      const movieData = await getMovie(currentSearchTerm);

      if (isResponseError(movieData)) {
        setError(true);
        setCurrentMovie(null);
      } else {
        setError(false);
        console.log('movie data in app', movieData);
        const normalizedMovie = normalizeMovieData(movieData);

        setCurrentMovie(normalizedMovie);
      }
    } catch (error) {
      setError(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (currentMovie !== null) {
      const isAlreadyAdded = movies.some(
        movie => movie.imdbId === currentMovie.imdbId,
      );

      if (!isAlreadyAdded) {
        setMovies(prevMovies => [...prevMovies, currentMovie]);
      }

      setCurrentMovie(null);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    console.log('Error', isError);
  }, [isError]);

  useEffect(() => {
    console.log('Current normalized Movie', currentMovie);
  }, [currentMovie]);

  useEffect(() => {
    console.log(currentSearchTerm, 'currentSearch');
  }, [currentSearchTerm]);

  return (
    <>
      <form className="find-movie">
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
              className={cn('input', { 'is-danger': isError })}
              onChange={(e) => handleSearch(e.target.value)}
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
              type="button"
              className={cn('button is-light', {
                'is-loading': isLoading && !isError,
              })}
              onClick={handleFind}
              disabled={!currentSearchTerm}
            >
              {currentSearchCount > 0 ? 'Search Again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {currentMovie && (
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

      <div className="container" data-cy="previewContainer">
        {currentMovie && (
          <>
            <h2 className="title" data-cy="movieTitle">Preview</h2>
            <MovieCard movie={currentMovie} />
          </>
        )}
      </div>
    </>
  );
};
