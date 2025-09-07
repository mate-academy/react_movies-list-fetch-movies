import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setErrorMessage('');
  };

  const transformMovieData = (movieData: MovieData): Movie => ({
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl:
      movieData.Poster !== 'N/A'
        ? movieData.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    imdbId: movieData.imdbID,
  });

  const fetchMovie = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setErrorMessage("Can't find a movie with such a title");
        setMovie(null);
      } else {
        const movieData = transformMovieData(response);

        setMovie(movieData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setMovie(null);
    setTitle('');
  };

  const handleAddMovie = () => {
    if (
      movie &&
      !movies.some(existingMovie => existingMovie.imdbId === movie.imdbId)
    ) {
      setMovies(prevMovies => [...prevMovies, movie]);
      reset();
    } else {
      reset();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={fetchMovie}>
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
              className="input 'is-danger'"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={isLoading || !title}
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
