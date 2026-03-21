import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { clsx } from 'clsx';
import { NormalizedMovie } from '../../types/NormalizedMovie';

interface Props {
  movies: NormalizedMovie[];
  onMovieAdd: (movie: NormalizedMovie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, onMovieAdd }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<NormalizedMovie | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(movieTitle)
      .then(movie => {
        if ('Error' in movie) {
          setError(movie.Error);

          return;
        }

        const newMovie = {
          ...movie,
          Poster:
            movie.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        };

        setFoundedMovie(newMovie);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const HandleMovieTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setMovieTitle(event.target.value);
    setError('');
  };

  const handleMovieAdd = (newMovie: NormalizedMovie) => {
    const duplicate = movies.find(movie => movie.imdbID === newMovie.imdbID);

    if (!duplicate) {
      onMovieAdd([...movies, newMovie]);
    }

    setFoundedMovie(null);
    setMovieTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={clsx('input', {
                'is-danger': error,
              })}
              onChange={HandleMovieTitleChange}
              value={movieTitle}
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
              className={clsx('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!movieTitle}
            >
              Find a movie
            </button>
          </div>

          {foundedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleMovieAdd(foundedMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {foundedMovie && <MovieCard movie={foundedMovie} />}
      </div>
    </>
  );
};
