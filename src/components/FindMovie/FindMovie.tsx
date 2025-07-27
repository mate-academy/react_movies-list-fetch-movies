import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';

interface FindMovieProps {
  movies: Movie[];
  setMovies: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ movies, setMovies }) => {
  const [titleField, setTitleField] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleTitleField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
    setErrorMessage(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!titleField.trim()) {
      return;
    }

    setLoading(true);
    setErrorMessage(false);
    setMovie(null);

    getMovie(titleField.trim())
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setMovie(null);
          setErrorMessage(true);

          return;
        }

        const movieData = data as MovieData;

        const findMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setMovie(findMovie);
      })
      .catch(() => setErrorMessage(true))
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    const isAlreadyAtList = movies.some(m => m.imdbId === movie?.imdbId);

    if (!isAlreadyAtList) {
      setMovies(movie);
    }

    setMovie(null);
    setTitleField('');
    setErrorMessage(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={cn('input', { 'is-danger': errorMessage })}
              value={titleField}
              onChange={handleTitleField}
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!titleField.trimStart() || loading}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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
