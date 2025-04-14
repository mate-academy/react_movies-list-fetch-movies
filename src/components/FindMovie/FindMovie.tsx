import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onQuery: (query: string) => void;
  onAddMovie: (movie: Movie) => void;
  query: string;
};

export const FindMovie: React.FC<Props> = ({ onQuery, onAddMovie, query }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuery(event.target.value);
    setErrorMessage(''); // Clear error message when the input changes
    setPreviewMovie(null); // Clear preview when the input changes
  };

  const handleFindMovie = async () => {
    if (query.trim() === '') {
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPreviewMovie(null);

    try {
      const result = await getMovie(query);

      if ('Response' in result && result.Response === 'False') {
        setErrorMessage(result.Error);

        return;
      }

      if ('Title' in result) {
        // Normalize the movie data
        const normalizedMovie = {
          title: result.Title,
          description: result.Plot,
          imgUrl:
            result.Poster !== 'N/A'
              ? result.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setPreviewMovie(normalizedMovie);
      } else {
        setErrorMessage('Invalid movie data received.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
      onQuery(''); // Clear the input field
      setPreviewMovie(null); // Remove the preview
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => e.preventDefault()}>
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
              className={`input ${errorMessage ? 'is-danger' : ''}`} // Apply 'is-danger' only if there's an error
              value={query}
              onChange={handleInputChange}
            />
          </div>
          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              onClick={handleFindMovie}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {previewMovie && (
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

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
