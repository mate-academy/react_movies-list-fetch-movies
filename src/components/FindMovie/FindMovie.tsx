import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (updateMovies: (prevMovies: Movie[]) => Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  // eslint-disable-next-line no-console
  console.log(error);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setQuery(value);
  };

  const handleFindMovieButton = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    setLoaded(true);
    const fetchedResult = await getMovie(query);

    if ('Response' in fetchedResult && fetchedResult.Response === 'False') {
      setError(true);
      setLoaded(false);

      return;
    }

    setError(false);

    const { Poster, Title, Plot, imdbID } = fetchedResult as MovieData;
    const image =
      Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : Poster;

    const foundMovie = {
      title: Title,
      description: Plot,
      imgUrl: image,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setMovie(foundMovie);
    setLoaded(false);
  };

  const handleAddButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    onAdd(prevMovies => {
      if (prevMovies.some(prevMovie => prevMovie.imdbId === movie?.imdbId)) {
        return prevMovies;
      }

      return movie ? [...prevMovies, movie] : prevMovies;
    });

    setMovie(null);
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
              onChange={handleInput}
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
              disabled={!query}
              className={cn('button is-light', { 'is-loading': loaded })}
              onClick={handleFindMovieButton}
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
                onClick={handleAddButton}
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
