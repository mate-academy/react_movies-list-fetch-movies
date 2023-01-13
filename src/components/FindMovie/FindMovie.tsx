import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

const ifNoPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (currentMovie: Movie) => void
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchQuery)
      .then(r => {
        if ('Error' in r) {
          throw new Error('error');
        }

        const {
          imdbID,
          Title,
          Poster,
          Plot,
        } = r as MovieData;

        const poster = Poster !== 'N/A'
          ? Poster
          : ifNoPicture;

        setCurrentMovie({
          title: Title,
          description: Plot,
          imgUrl: poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      })
      .catch(() => (
        setError(true)
      ))
      .finally(() => (
        setIsLoading(false)
      ));
  };

  const handleAddMovie = () => {
    const inMoviesArray = movies
      .filter(movie => movie.title === currentMovie?.title).length === 1;

    if (currentMovie !== null && !inMoviesArray) {
      addMovie(currentMovie);
    }

    setCurrentMovie(null);
    setSearchQuery('');
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
              className="input is-dander"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setError(false);
              }}
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={handleSubmit}
              disabled={!searchQuery}
            >
              {!currentMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
