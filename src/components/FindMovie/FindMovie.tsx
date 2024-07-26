import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import cn from 'classnames';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  loading,
  setLoading,
  movies,
  setMovies,
}) => {
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  function normalizeMovieData(data: MovieData): Movie {
    return {
      title: data.Title || 'Unknown Title',
      description: data.Plot || 'No description available.',
      imgUrl:
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID || 'N/A',
    };
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const hanleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(true);
          setMovie(null);
        } else {
          const movieData = response as MovieData;

          const { Poster, Title, Plot, imdbID } = movieData;

          const normalizedMovie = normalizeMovieData({
            Poster,
            Title,
            Plot,
            imdbID,
          });

          setMovie(normalizedMovie);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (movie && !movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
      setMovie(null);
      setQuery('');
    } else {
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={hanleSubmit}>
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
              value={query}
              onChange={handleInputChange}
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query || loading}
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
