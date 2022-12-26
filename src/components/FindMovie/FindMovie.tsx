import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  async function submitForm(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    const findMovieData = await getMovie(inputValue);

    try {
      if ('Error' in findMovieData) {
        setShowError(true);
      } else {
        setShowError(false);

        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = findMovieData;

        const findMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(findMovie);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function addMovie() {
    if (movie && movies.every(item => item.imdbId !== movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setInputValue('');
  }

  const changeInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setShowError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => submitForm(e)}
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
              value={inputValue}
              onChange={(event) => changeInputValue(event)}
            />
          </div>

          {showError && (
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
                isLoading
                  ? 'button is-light is-loading' : 'button is-light'
              }
              disabled={!inputValue}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
