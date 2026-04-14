import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

export const FindMovie: React.FC<{
  onAddMovie: (movie: Movie) => void;
}> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError('');
  };

  const handleAddMovie = () => {
    if (!foundMovie) {
      return;
    }

    onAddMovie(foundMovie);
    setTitle('');
    setFoundMovie(null);
    setError('');
  };

  const normalizeMovie = (data: MovieData): Movie => {
    return {
      imdbId: data.imdbID,
      title: data.Title,
      description: data.Plot,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imgUrl:
        data.Poster !== 'N/A'
          ? data.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') {
      setError('Please enter a movie title.');

      return;
    }

    setError('');
    setIsLoading(true);
    setFoundMovie(null);

    try {
      const response = await getMovie(title.trim());

      if ('Response' in response && response.Response === 'False') {
        setError(response.Error || 'Movie not found');
        setFoundMovie(null);

        return;
      }

      if ('imdbID' in response) {
        setFoundMovie(normalizeMovie(response));
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setFoundMovie(null);
    } finally {
      setIsLoading(false);
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
              className={`input ${error ? 'is-danger' : ''}`.trim()}
              value={title}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`.trim()}
              disabled={!title.trim() || isLoading}
            >
              Find a movie
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
