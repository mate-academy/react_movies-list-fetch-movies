import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[],
  onSetMovies: (movie: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, onSetMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const composeFoundMovie = (movieData: MovieData) => {
    const {
      Title, Plot, Poster, imdbID,
    } = movieData;

    return {
      title: Title,
      description: Plot,
      imgUrl: Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };
  };

  const onLoadMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const movieDataFromServer = await getMovie(query);

      if ('Title' in movieDataFromServer) {
        const newMovie = composeFoundMovie(movieDataFromServer);

        setMovie(newMovie);
      } else {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onAddMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (movie && !movies.some(film => film.imdbId === movie.imdbId)) {
      onSetMovies([...movies, movie]);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onLoadMovie}>
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
              className="input is-dander"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setHasError(false);
              }}
            />
          </div>

          {hasError && (
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={!query}
            >
              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
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
