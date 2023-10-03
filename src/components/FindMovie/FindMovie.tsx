import React, { useContext, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MoviesContect } from '../../Context/MovieContext';

export const FindMovie: React.FC = () => {
  const { movies, setMovies } = useContext(MoviesContect);

  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(title.toLowerCase().trim())
      .then(res => {
        if ('Response' in res && res.Response === 'False') {
          setHasError(true);
          setMovie(null);
        } else {
          const newRes = res as MovieData;
          const newMovie: Movie = {
            title: newRes.Title || '...has no title...',
            description: newRes.Plot || '',
            imgUrl: newRes.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : newRes.Poster,
            imdbUrl: `https://www.imdb.com/title/${newRes.imdbID}`,
            imdbId: newRes.imdbID,
          };

          setMovie(newMovie);
          setHasError(false);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const addMovie = () => {
    if (movie && movies && !movies.some(someMovie => {
      return someMovie.imdbId === movie.imdbId;
    })) {
      setMovies((currentMovies) => [...currentMovies, movie]);
    }

    setTitle('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
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
              className={cn('input', { 'is-danger': hasError })}
              value={title}
              onChange={handleTitle}
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
              className={cn('button is-light', {
                'is-loading': loading,
              })}
              disabled={!title}
            >
              {!movie ? (
                'Find a movie'
              ) : (
                'Search again'
              )}

            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie()}
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
