import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isNotFound, setIsNotFound] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    if (isNotFound) {
      setIsNotFound(null);
    }
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (query) {
      const trimmedQuery = query.trim().toLowerCase();

      getMovie(trimmedQuery)
        .then((response) => {
          if (Object.hasOwn(response, 'Title')) {
            const {
              Title, Plot, Poster, imdbID,
            } = response as MovieData;

            const imgUrl
            = Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster;

            const newMovie = {
              title: Title,
              description: Plot,
              imgUrl,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            };

            setMovie(newMovie);
            setIsNotFound(null);
          }

          if (Object.hasOwn(response, 'Error')) {
            setIsNotFound(response as ResponseError);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  const handleListAdd = () => {
    const inTheList = movies.some((film) => film.imdbId === movie?.imdbId);

    if (!inTheList && movie) {
      setMovies([
        ...movies,
        movie,
      ]);
    }

    setIsNotFound(null);
    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitForm}>
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
              className={`input ${isNotFound && 'is-danger'}`}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {isNotFound?.Error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;ot find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading && 'is-loading'}`}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleListAdd}
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
