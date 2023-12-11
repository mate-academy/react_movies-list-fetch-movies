import React, { useState } from 'react';
import classnames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  addMovieToList: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ addMovieToList }) => {
  const [title, setTitle] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setLoading(true);

    getMovie(title)
      .then((result) => {
        if ('Error' in result) {
          setError(result.Error);
        } else {
          setMovieData(result);
          setError(null);
        }
      })
      .catch(() => setError('Unexpected error'))
      .finally(() => setLoading(false));
  };

  const handleAddToList = () => {
    if (movieData) {
      const newMovie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl: movieData.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
        imdbId: movieData.imdbID,
      };

      addMovieToList(newMovie);
      setMovieData(null);
      setTitle('');
    }
  };

  const isButtonDisabled = !title.trim(); // Disable the button if the input is empty or contains only whitespace

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset the error when the user types
    setSubmitted(false);
    setTitle(e.target.value);
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
              className={classnames(
                'input',
                {
                  'is-danger': submitted && error,
                },
              )}
              onChange={handleInputChange}
              value={title}
            />
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={classnames(
                  'button',
                  'is-light',
                  { 'is-loading': loading },
                )}
                disabled={isButtonDisabled}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              {movieData && (
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handleAddToList}
                >
                  Add to the list
                </button>
              )}
            </div>
          </div>

          {movieData && (
            <div className="container" data-cy="previewContainer">
              <MovieCard movie={movieData} />
            </div>
          )}
          {submitted && error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
      </form>
    </>
  );
};
