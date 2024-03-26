import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie = () => {} }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  function normalizeMovieData(movieData: MovieData): Movie {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl:
        movieData.Poster !== 'N/A'
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      return;
    }

    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      getMovie(query).then((result: MovieData | ResponseError) => {
        if ('Response' in result && result.Response === 'False') {
          setErrorMessage("Can't find a movie with such a title");
          setMovie(null);
        } else {
          setMovie(normalizeMovieData(result as MovieData));
        }
      });
    }, 1000);
    getMovie(query).finally(() => {
      setLoading(false);
      setLoaded(true);
    });
  };

  const addMovie = (currentmovie: Movie) => {
    onAddMovie(currentmovie);
    setQuery('');
    setMovie(null);
    setLoaded(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={submit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'input is-danger': errorMessage,
              })}
              onChange={handleQueryChange}
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
              className={classNames('button is-light ', {
                'is-loading': loading,
              })}
              disabled={!query || loading}
            >
              {!loaded ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
