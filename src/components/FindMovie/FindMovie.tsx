import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  function handleFinding(e: React.FormEvent): void {
    e.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(fetchedMovie => {
        if ('Poster' in fetchedMovie) {
          const DEFAULT_IMD =
            'https://via.placeholder.com/360x270.png?text=no%20preview';
          const formattedMovie: Movie = {
            title: fetchedMovie.Title,
            description: fetchedMovie.Plot,
            imgUrl:
              fetchedMovie.Poster && fetchedMovie.Poster !== 'N/A'
                ? fetchedMovie.Poster
                : DEFAULT_IMD,

            imdbUrl: `https://www.imdb.com/title/${fetchedMovie.imdbID}`,
            imdbId: fetchedMovie.imdbID,
          };

          setMovie(formattedMovie);
        } else {
          setErrorMessage(fetchedMovie.Error || 'Movie not found');
          setMovie(null);
        }
      })
      .catch(() => setErrorMessage('Can&apos;t find a movie with such a title'))
      .finally(() => setLoading(false));
  }

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
              className={`input ${errorMessage && 'is-danger'}`}
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setQuery(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && (
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
              className={`button ${loading ? 'is-loading' : 'is-light'}`}
              disabled={query === ''}
              onClick={handleFinding}
            >
              Find a movie
            </button>
          </div>
          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd((prevMovies: Movie[]) => {
                    const alreadyExists = prevMovies.some(
                      prevMovie => prevMovie.imdbId === movie.imdbId,
                    );

                    if (alreadyExists) {
                      return prevMovies;
                    }

                    return [...prevMovies, movie];
                  });

                  setMovie(null);
                  setQuery('');
                }}
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
          <MovieCard movie={movie} key={movie.imdbId} />
        </div>
      )}
    </>
  );
};
