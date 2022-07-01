import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  handleAddMovie: (newMovie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ handleAddMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [hasFoundMovie, setHasFoundMovie] = useState(true);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieRepeated, setIsMovieRepeated] = useState(false);

  const doesMovieExist = (movie: Movie) => (
    movies.find(({ imdbID }) => imdbID === movie.imdbID)
  );

  const findMovie = async () => {
    setIsLoading(true);

    const response = await fetch(`https://www.omdbapi.com/?apikey=1c29b9bf&t=${title}`);
    const movie = await response.json();

    if (doesMovieExist(movie)) {
      setIsMovieRepeated(true);
      setIsLoading(false);

      return;
    }

    if (movie.Response === 'False') {
      setHasFoundMovie(false);
      setIsLoading(false);

      return;
    }

    setNewMovie(movie);
    setIsLoading(false);
  };

  function handleSubmission(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setTitle('');
    setNewMovie(null);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmission}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': !hasFoundMovie })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setHasFoundMovie(true);
                setIsMovieRepeated(false);
              }}
            />
          </div>

          {hasFoundMovie || (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {isMovieRepeated && (
            <p className="help is-danger">
              Movie already exists
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={cn('button is-light', { 'is-loading': isLoading })}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={() => {
                if (newMovie) {
                  handleAddMovie(newMovie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard movie={newMovie} />
      </div>
    </>
  );
};
