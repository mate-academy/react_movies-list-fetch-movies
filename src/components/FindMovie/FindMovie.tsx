import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await getMovie(title.trim());

      if ('Response' in data && data.Response === 'False') {
        setError(data.Error || "Can't find a movie with such a title");
        setPreviewMovie(null);
      } else {
        const movieData = data as MovieData;
        const movie: Movie = {
          imdbId: movieData.imdbID,
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
        };

        setPreviewMovie(movie);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const alreadyExists = previewMovie
    ? movies.some(movie => movie.imdbId === previewMovie.imdbId)
    : false;

  return (
    <>
      <form onSubmit={handleSearchSubmit} className="find-movie">
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
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setError('');
              }}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={title.trim() === ''}
            >
              {previewMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!previewMovie}
                onClick={() => {
                  if (!previewMovie) {
                    return;
                  }

                  if (alreadyExists) {
                    setPreviewMovie(null);
                    setTitle('');
                    setError('');

                    return;
                  }

                  setMovies(prev => [...prev, previewMovie]);
                  setPreviewMovie(null);
                  setTitle('');
                  setError('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(isLoading || previewMovie) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          {isLoading && (
            <div className="has-text-centered" data-cy="loader">
              <button className="button is-loading is-light is-large">
                Loading
              </button>
            </div>
          )}

          {!isLoading && previewMovie && <MovieCard movie={previewMovie} />}
        </div>
      )}
    </>
  );
};
