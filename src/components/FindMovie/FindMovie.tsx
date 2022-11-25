import React, {
  useState,
} from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const findMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const findData = await getMovie(query);

    try {
      if ('Error' in findData) {
        setIsError(true);
      } else {
        const {
          Poster,
          Title,
          Plot,
          imdbID,
        } = findData;

        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovie(newMovie);
      }
    } catch (error) {
      throw new Error(`Unexpected error${error}`);
    } finally {
      setIsLoading(true);
    }
  };

  const addToMovieList = () => {
    if (movie) {
      addMovie(movie);
      setIsLoading(true);
      setMovie(undefined);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
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
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
              className={isLoading
                ? 'button is-light'
                : 'button is-loading'}
              onClick={() => setIsLoading(false)}
              disabled={query.length === 0}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addToMovieList}
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
