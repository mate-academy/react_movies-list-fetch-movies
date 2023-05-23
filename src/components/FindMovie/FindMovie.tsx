import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

interface Props {
  addMovie: (selectedMovie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    setHasError(false);
    setTitle(input);
  };

  const preloadMovie = async (query = title) => {
    if (hasError) {
      setHasError(false);
    }

    setIsLoading(true);

    const movieData = await getMovie(query);

    try {
      if ('Title' in movieData) {
        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = movieData;

        const film: Movie = {
          title: Title,
          description: Plot,
          imgUrl:
            Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setSelectedMovie(film);
      }

      if ('Error' in movieData) {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addMovieToList = () => {
    if (
      selectedMovie
      && !movies.find((film) => film.imdbId === selectedMovie.imdbId)
    ) {
      addMovie(selectedMovie);
    }

    // Reset (hide) movie card and reset title
    setSelectedMovie(null);
    setTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={(e) => e.preventDefault()}>
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
              value={title}
              onChange={handleTitleChange}
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
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title}
              onClick={() => preloadMovie()}
            >
              Find a movie
            </button>
          </div>

          {selectedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard selectedMovie={selectedMovie} />
        </div>
      )}
    </>
  );
};
