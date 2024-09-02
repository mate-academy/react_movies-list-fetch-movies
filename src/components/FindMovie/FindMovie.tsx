import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type Props = {
  onSubmit: (movie: Movie) => void;
};
export const FindMovie: React.FC<Props> = ({ onSubmit }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!movieTitle.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setMovie(null);

    try {
      const result = await getMovie(movieTitle);

      if ((result as ResponseError).Response === 'False') {
        setError("Can't find a movie with such a title");
      } else {
        const movieData = result as MovieData;

        const normalizedMovie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: movieData.imdbUrl,
          imdbId: movieData.imdbID,
        };

        setMovie(normalizedMovie);
      }
    } catch (e) {
      setError('An error occurred while fetching the movie');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      onSubmit(movie);
      setMovie(null);
      setMovieTitle('');
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
              value={movieTitle}
              onChange={handleInputChange}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!movieTitle.trim()}
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
