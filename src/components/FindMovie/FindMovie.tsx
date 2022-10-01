import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';

type Props = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [movie, setMovie] = useState<Movie | undefined>();
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindMovie = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const movieFromServer = await getMovie(query.trim());

    if (movieFromServer.Response === 'False') {
      setError(true);
    } else {
      setError(false);
      setMovie({
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
        imdbId: movieFromServer.imdbID,
      });
    }

    setIsLoading(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      if (movies.find(m => m.imdbId === movie.imdbId)) {
        setQuery('');
        setMovie(undefined);
        // eslint-disable-next-line no-alert
        alert('This movie is already in the list');

        return;
      }

      setMovies([
        ...movies,
        movie,
      ]);

      setQuery('');
      setMovie(undefined);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleFindMovie(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              onChange={(eventChange) => {
                setQuery(eventChange.target.value);
              }}
              className="input is-dander"
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
            {!isLoading ? (
              <button
                data-cy="searchButton"
                type="submit"
                className="button is-light"
                disabled={!query.trim()}
              >
                {movie ? 'Search again' : 'Find a movie'}
              </button>
            ) : (
              <Loader />
            )}

          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAddMovie();
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
