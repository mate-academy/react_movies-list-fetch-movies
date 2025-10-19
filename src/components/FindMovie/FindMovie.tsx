import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
};

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function mapToMovie(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ onAddMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<MovieData | ResponseError | null>(null);

  const [loading, setLoading] = useState(false);

  const isAlreadyAdded =
    movie && movie?.Response === 'True'
      ? movies.some(item => item.imdbId === movie.imdbID)
      : false;

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(data => {
        setMovie(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleForm}>
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
              onChange={e => {
                setQuery(e.target.value);
                setMovie(null);
              }}
            />
          </div>
          {movie && movie.Response === 'False' && (
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {movie && movie?.Response === 'True' && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie && movie.Response === 'True') {
                    if (isAlreadyAdded) {
                      setMovie(null);
                      setQuery('');

                      return;
                    }

                    onAddMovie(mapToMovie(movie));
                    setMovie(null);
                    setQuery('');
                  }
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && movie.Response === 'True' && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={mapToMovie(movie)} />
        </div>
      )}
    </>
  );
};
