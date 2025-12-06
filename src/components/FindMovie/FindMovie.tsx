import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieSearched, setMovieSearched] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleMovieSearched = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setMovieSearched(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasError(false);
    setLoading(true);

    const normalize = (movieData: MovieData) => {
      const movieNormalized: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imdbId: movieData.imdbID,
        imgUrl: movieData.Poster
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/pt/title/${movieData.imdbID}`
      };

      return movieNormalized;
    };

    try {
      const movieFetched = await getMovie(movieSearched);

      if ('Poster' in movieFetched) {
        setMovie(normalize(movieFetched));
      } else {
        throw new Error();
      }
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  //es-
  const handleAddMovie = (/*event: MouseEvent<HTMLButtonElement>*/) => {
    if (movie && !movies.some(movieItem => movieItem.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setMovieSearched('');
    setMovie(null);
  };

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
              className={hasError ? 'input is-danger' : 'input'}
              value={movieSearched}
              onChange={handleMovieSearched}
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
            {movieSearched === '' ? (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                disabled
              >
                Find a movie
              </button>
            ) : (
              <button
                data-cy="searchButton"
                type="submit"
                className={
                  loading ? 'button is-light is-loading' : 'button is-light'
                }
              >
                Find a movie
              </button>
            )}
          </div>

          {movie && (
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
