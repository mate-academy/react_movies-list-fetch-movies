import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAddMovie }) => {
  const [movieTitle, setMovieTitle] = React.useState('');
  const [foundMovie, setFoundMovie] = React.useState<Movie | null>(null);
  const [showError, setShowError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    if (showError) {
      setShowError(false);
    }
  };

  const normalizeMovie = (data: MovieData): Movie => ({
    imdbId: data.imdbID,
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster && data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!movieTitle.trim()) {
      return;
    }

    setIsLoading(true);
    setShowError(false);

    getMovie(movieTitle.trim())
      .then((response: MovieData | ResponseError) => {
        if ('Response' in response && response.Response === 'False') {
          setFoundMovie(null);
          setShowError(true);

          return;
        }

        const movie = normalizeMovie(response as MovieData);

        setFoundMovie(movie);
      })
      .catch(() => {
        setFoundMovie(null);
        setShowError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (!foundMovie) {
      return;
    }

    // Don't add if movie already exists in the list
    if (!movies.some(m => m.imdbId === foundMovie.imdbId)) {
      onAddMovie(foundMovie);
    }

    // Always clear the form and preview
    setFoundMovie(null);
    setMovieTitle('');
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
              className={`input ${showError ? 'is-danger' : ''}`}
              value={movieTitle}
              onChange={handleInputChange}
            />
          </div>

          {showError && (
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
              disabled={!movieTitle.trim()}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
