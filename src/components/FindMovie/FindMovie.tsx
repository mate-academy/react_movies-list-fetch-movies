import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isFound, setIsFound] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const normalizedMovieData = (movieData: MovieData): Movie => {
    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl:
        movieData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieData.Poster,
      imdbUrl: 'https://www.imdb.com/title/' + movieData.imdbID,
      imdbId: movieData.imdbID,
    };
  };

  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setIsFound(false);

    getMovie(title)
      .then(response => {
        if ('Error' in response) {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie(normalizedMovieData(response as MovieData));
        setIsFound(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddMovie = () => {
    const uniqueMovies = movies.every(
      currentMovie => currentMovie?.imdbId !== movie?.imdbId,
    );

    if (uniqueMovies && movie) {
      setMovies([...movies, movie]);
    }

    setTitle('');
    setMovie(null);
    setIsFound(false);
    setIsFound(false);
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={handleChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.trim().length}
            >
              Find a movie
            </button>
          </div>

          {isFound && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
