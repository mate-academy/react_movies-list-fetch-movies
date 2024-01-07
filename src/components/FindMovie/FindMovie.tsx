import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

interface Props {
  onMovieAdd: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const isButtonDisabled = query.trim() === '';

  const mutateApiData = (movieFromApi: MovieData): Movie => {
    const mutatedMovie = {
      title: movieFromApi.Title,
      description: movieFromApi.Plot,
      imgUrl: movieFromApi.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieFromApi.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}`,
      imdbId: movieFromApi.imdbID,
    };

    return mutatedMovie;
  };

  const searchMovie = (name: string) => {
    const trimedName = name.trim();

    if (trimedName === '') {
      return;
    }

    setIsLoading(true);
    setIsError(false);

    getMovie(trimedName)
      .then(res => {
        if ('Error' in res) {
          setIsLoading(false);
          setIsError(true);
        } else {
          setIsError(false);
          setIsLoading(false);

          const newMovie = mutateApiData(res);

          setMovie(newMovie);
        }
      });
  };

  const addMovie = () => {
    if (movie) {
      onMovieAdd(movie);
    }

    setMovie(undefined);
    setQuery('');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(e.target.value);
  };

  const handleSubmitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    searchMovie(query);
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
              className={`input ${isError && 'is-danger'}`}
              value={query}
              onChange={handleInput}
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
              className={`button is-light ${isLoading && 'is-loading'}`}
              disabled={isButtonDisabled}
              onClick={handleSubmitSearch}
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
                onClick={() => addMovie()}
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
