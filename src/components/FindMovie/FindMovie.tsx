import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hideTitle, setHideTitle] = useState(false);

  const handleAddClick = () => {
    if (moviePreview) {
      onAdd(moviePreview);
      setQuery('');
      setMoviePreview(null);
    }
  };

  async function receiveMovie(searchQuery: string) {
    setIsLoading(true);

    try {
      const result = await getMovie(searchQuery);

      if (result.Response === 'False') {
        setError(true);
      } else {
        const data = result as MovieData;

        const normalizedMovie: Movie = {
          imdbId: data.imdbID,
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
        };

        setMoviePreview(normalizedMovie);
      }
    } catch (err) {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form className="find-movie">
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
              className={`input ${hideTitle ? 'is-danger' : ''}`}
              value={query}
              onChange={event => {
                setHideTitle(false);
                setError(false);
                setQuery(event.target.value);
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
              disabled={query === ''}
              onClick={event => {
                if (!query) {
                  setHideTitle(true);
                }

                event.preventDefault();
                receiveMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={handleAddClick}
              disabled={!moviePreview}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {moviePreview ? <MovieCard moviePreview={moviePreview} /> : ''}
      </div>
    </>
  );
};
