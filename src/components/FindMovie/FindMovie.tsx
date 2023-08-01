import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovieToList: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovieToList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null | false>(null);
  const [loading, setLoading] = useState(false);
  const prevQuery = useRef('');

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(movieData => {
        if ('Title' in movieData) {
          setMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
            imgUrl: movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
          });
        } else {
          setMovie(false);
        }
      })
      .finally(() => {
        prevQuery.current = query;
        setLoading(false);
      });
  };

  const handleAddToList = () => {
    if (movie) {
      onAddMovieToList(movie);
    }

    setMovie(null);
    setQuery('');
  };

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
              className="input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {movie === false && query === prevQuery.current && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': loading },
              )}
              disabled={!query}
              onClick={handleSubmit}
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
