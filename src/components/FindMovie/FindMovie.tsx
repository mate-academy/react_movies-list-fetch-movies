import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [request, setRequest] = useState('');
  const [isFindDisabled, setIsFindDisabled] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function getPicture(film: MovieData) {
    return film.Poster && film.Poster !== 'N/A'
      ? film.Poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }

  function resetForm() {
    setMovie(null);
    setIsFindDisabled(true);
    setRequest('');
  }

  const handleInputChange = ({ currentTarget }:
  React.FormEvent<HTMLInputElement>) => {
    setRequest(currentTarget.value);

    if (currentTarget.value) {
      setIsFindDisabled(false);
      setIsError(false);
    } else {
      setIsFindDisabled(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const result = await getMovie(request);

      if (result.Response === 'True') {
        const picture = getPicture(result);

        const newMovie = {
          title: result.Title,
          description: result.Plot,
          imgUrl: picture,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setMovie(newMovie);
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleListMovies = () => {
    if (movie && movies.findIndex(film => film.imdbId === movie.imdbId)) {
      const newList = [...movies, movie];

      setMovies(newList);
    }

    resetForm();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              value={request}
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={handleInputChange}
            />
          </div>

          {isError && (
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
              disabled={isFindDisabled}
            >

              {!movie || isError ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleListMovies}
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
