import React, { memo, useMemo, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { MovieCard } from '../MovieCard/MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

type Props = {
  movies: Movie[];
  onAdd: (newMovie: Movie) => void;
};

const defaultImg = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = memo(({ movies, onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorOnLoading, setErrorOnLoading] = useState(false);
  const [isFilmInList, setIsFilmInList] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const loadedMovieData = await getMovie(query);

    if ('Error' in loadedMovieData) {
      setErrorOnLoading(true);
    } else {
      const newMovie = {
        title: loadedMovieData.Title,
        description: loadedMovieData.Plot,
        imgUrl: loadedMovieData.Poster !== 'N/A'
          ? loadedMovieData.Poster
          : defaultImg,
        imdbUrl: `https://www.imdb.com/title/${loadedMovieData.imdbID}`,
        imdbId: loadedMovieData.imdbID,
      };

      setMovie(newMovie);
    }

    setIsLoading(false);
  };

  const clearFormOnAddMovie = () => {
    setQuery('');
    setMovie(null);
  };

  const handleInputChange = (value: string) => {
    if (isFilmInList) {
      setIsFilmInList(false);
    }

    setQuery(value);

    if (isErrorOnLoading) {
      setErrorOnLoading(false);
    }
  };

  const moviesImdbId = useMemo(() => (
    movies.map(film => film.imdbId)
  ), [movies]);

  const handleAddMovie = (movieToAdd: Movie) => {
    if (!moviesImdbId.includes(movieToAdd.imdbId)) {
      onAdd(movieToAdd);
    } else {
      setIsFilmInList(true);
    }

    clearFormOnAddMovie();
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
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={(event) => handleInputChange(event.target.value)}
            />
          </div>

          {isErrorOnLoading && (
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query.trim()}
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
                onClick={() => handleAddMovie(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>

        {isFilmInList && (
          <p className="help is-danger">This film is already in the list</p>
        )}
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
});
