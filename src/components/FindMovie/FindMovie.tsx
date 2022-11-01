import cn from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [isMovieLoaded, setIsMovieLoaded] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [isMovieFounded, setIsMovieFounded] = useState(false);
  const [isMovieAlredyInList, setIsMovieAlredyInList] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsMovieFounded(true);
    setIsMovieAlredyInList(false);
  };

  const getMovieByTitle = (title: string) => {
    setIsMovieLoading(true);
    getMovie(title)
      .then((data) => {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty('Error')) {
          setIsMovieFounded(false);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = data as MovieData;

          const movieImg = Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: movieImg,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
          setIsMovieFounded(true);
        }

        setIsMovieLoaded(true);
        setIsMovieLoading(false);
      })
      .catch(error => {
        throw new Error(error);
      });
  };

  const handleAddMovie = () => {
    if (
      movie
      && !movies.find(({ imdbId }) => imdbId === movie.imdbId)
    ) {
      addMovie(movie);
    } else {
      setIsMovieAlredyInList(true);
    }

    setMovie(null);
    setQuery('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getMovieByTitle(query);
  };

  const isNoMoviesWithSuchTitle = isMovieLoaded && !isMovieFounded;

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              onChange={handleInputChange}
            />
          </div>

          {isNoMoviesWithSuchTitle && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {isMovieAlredyInList && (
            <p className="help is-danger" data-cy="errorMessage">
              Movie is alredy in the movies list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isMovieLoading,
              })}
              disabled={query.trim() === ''}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {isMovieLoaded && movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
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
