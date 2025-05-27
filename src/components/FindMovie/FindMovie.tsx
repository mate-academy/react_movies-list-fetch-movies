import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type FindMovieProps = {
  addMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<FindMovieProps> = ({ addMovie, movies }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [visibleLoader, setVisibleLoader] = useState(false);

  const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setError(false);
  };

  const handleFindMovie = async (event: React.FormEvent) => {
    event.preventDefault();
    setVisibleLoader(true);
    setError(false);

    if (input.trim() === '') {
      setError(true);
      
      return;
    }

    await getMovie(input)
      .then(response => {
        if ('Error' in response) {
          setError(true);
        } else if (!movie || movie.imdbId !== response.imdbID) {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster && response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => setVisibleLoader(false));
  };

  const handleAddToList = () => {
    const result = movies.every(mov => mov.imdbId !== movie?.imdbId);

    if (result && movie !== null) {
      addMovie(movie);
      setMovie(null);
      setInput('');
    } else {
      setMovie(null);
      setInput('');
    }
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={input}
              onChange={event => handleEventChange(event)}
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
              className={
                visibleLoader ? 'button is-light is-loading' : 'button is-light'
              }
              disabled={input === ''}
              onClick={handleFindMovie}
            >
              {`${movie ? 'Search again' : 'Find a movie'}`}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
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
