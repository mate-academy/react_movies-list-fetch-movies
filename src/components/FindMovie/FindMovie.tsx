import React, {
  ChangeEvent,
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
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError('');
  };

  const findMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const findData = await getMovie(query);

      if ('Error' in findData) {
        setIsError('Can\'t find a movie with such a title');
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
      setIsLoading(false);
    }
  };

  const addToMovieList = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
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
              onChange={handleChange}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {isError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={!isLoading
                ? 'button is-light'
                : 'button is-loading'}
              disabled={!query.length}
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
