import React, { useState } from 'react';
import './FindMovie.scss';
import { ResponseError } from '../../types/ResponseError';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

function getNormalizedMovie(movieData: MovieData): Movie {
  const { Poster, Title, Plot, imdbID } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl: `${Poster === 'N/A' ? 'https://via.placeholder.com/360x270.png?text=no%20preview' : Poster}`,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const trimmedTitle = title.trim().toLowerCase();

    getMovie(trimmedTitle)
      .then(movieData => {
        if ((movieData as ResponseError).Error !== undefined) {
          setError(true);

          return;
        }

        setMovie(getNormalizedMovie(movieData as MovieData));
      })
      .finally(() => setLoading(false));
  };

  const handleAddToList = () => {
    setMovie(null);
    setTitle('');
    setError(false);

    if (movie) {
      onMovieAdd(movie);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setError(false);
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title}
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
                onClick={handleAddToList}
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
