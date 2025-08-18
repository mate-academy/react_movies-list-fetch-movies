import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function fetchQuery(search: string) {
    setLoading(true);
    getMovie(search)
      .then(result => {
        if ('Response' in result && result.Response === 'False') {
          setErrorMessage('Can not find a movie with such a title');
        } else {
          const data = result as MovieData; // уточнюємо тип
          const normalizedResult: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster && data.Poster !== 'N/A'
                ? data.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(normalizedResult);
          setErrorMessage('');
        }
      })
      .finally(() => setLoading(false));
  }

  const handleAdd = () => {
    const isMovie = movies.some(film => film.imdbId === movie?.imdbId);

    if (isMovie) {
      setQuery('');
      setMovie(null);
    }

    if (movie && !isMovie) {
      setMovies(current => [...current, movie]);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          fetchQuery(query);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to se1arch"
              className={!errorMessage ? 'input' : 'input is-danger'}
              value={query}
              onChange={e => {
                setErrorMessage('');
                setQuery(e.target.value);
              }}
            />
          </div>

          {!loading && errorMessage && query && (
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
              className={
                loading ? 'is-loading button is-light' : 'button is-light'
              }
              disabled={!query}
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
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !loading && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
