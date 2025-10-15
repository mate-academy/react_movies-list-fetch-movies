import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddMovie = (movie: Movie): void => {
    if (movies.some(m => m.imdbId === movie.imdbId)) {
      return;
    }

    setMovies(prev => [...prev, movie]);
  };

  const handleSubmit: React.FormEvent<HTMLFormElement> = event => {
    event.preventDefault();
    if (!title) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setFoundMovie(null);
    getMovie(title)
      .then(response => {
        if (response.Response === 'False') {
          setErrorMessage('Can`t find a movie with such a title');
        } else {
          setFoundMovie(response);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
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
              className={
                errorMessage.length === 0 ? 'input' : 'input is-danger'
              }
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setErrorMessage('');
              }}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={loading || title.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={e => {
                  e.preventDefault();

                  const normalizedMovie = {
                    title: foundMovie.Title,
                    description: foundMovie.Plot,
                    imgUrl:
                      foundMovie.Poster ||
                      'https://via.placeholder.com/' +
                        '360x270.png?text=no%20preview',
                    imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
                    imdbId: foundMovie.imdbID,
                  };

                  handleAddMovie(normalizedMovie);
                  setTitle('');
                  setFoundMovie(null);
                  setErrorMessage('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {foundMovie && (
          <MovieCard
            movie={{
              title: foundMovie.Title,
              description: foundMovie.Plot,
              imgUrl:
                foundMovie.Poster !== 'N/A'
                  ? foundMovie.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
              imdbId: foundMovie.imdbID,
            }}
          />
        )}
      </div>
    </>
  );
};
