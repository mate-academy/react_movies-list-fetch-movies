import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

interface Prop {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
}

function isErrorType(data: MovieData | ResponseError) {
  return 'Response' in data;
}

export const FindMovie: React.FC<Prop> = ({ onAddMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const preparedTitle = title.trim();

    if (!preparedTitle) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setMoviePreview(null);

    getMovie(preparedTitle)
      .then(data => {
        if (isErrorType(data)) {
          if (data.Response === 'False') {
            setIsError(true);

            return;
          }
        }

        const movieData = data as MovieData;

        const normalizedMovie: Movie = {
          imdbId: movieData.imdbID,
          title: movieData.Title,
          description:
            movieData.Plot !== 'N/A'
              ? movieData.Plot
              : 'No description available.',
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        };

        setMoviePreview(normalizedMovie);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (moviePreview) {
      const isAlreadyInList = movies.some(
        movie => movie.imdbId === moviePreview.imdbId,
      );

      if (!isAlreadyInList) {
        onAddMovie(moviePreview);
      }

      setTitle('');
      setMoviePreview(null);
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
              className={`input ${isError ? 'is-danger' : ''}`}
              value={title}
              onChange={handleTitleChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim() || isLoading}
            >
              Find a movie
            </button>
          </div>

          {moviePreview && (
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

      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
