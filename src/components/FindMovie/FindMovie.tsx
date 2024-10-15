import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie = ({ onAddMovie }: Props) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await getMovie(search);

      if ('Response' in response && response.Response === 'False') {
        setError(response.Error);

        return;
      }

      const movieData = response as MovieData;

      const normalizedMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl:
          movieData.Poster !== 'N/A'
            ? movieData.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      setMovie(normalizedMovie);
    } catch (e) {
      setError('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = (movieToAdd: Movie) => {
    if (movieToAdd) {
      onAddMovie(movieToAdd);
      setSearch('');
      setMovie(null);
    }
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
              className="input is-danger"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setError(null);
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={!search}
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
                onClick={() => {
                  handleAddMovie(movie);
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
