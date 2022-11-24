import React, {
  FormEvent,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchText, setSearchText] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [searchButtonText, setSearchButtonText] = useState('Find a movie');
  const [isLoading, setIsLoading] = useState(false);

  const searchTextHandler = useCallback((event) => {
    setSearchText(event.target.value);

    if (notFound) {
      setNotFound(false);
    }
  }, [notFound]);

  const submitSearchHandler = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await getMovie(searchText);

    if ('Error' in response) {
      setNotFound(true);
      setMovie(null);
      setIsLoading(false);

      return;
    }

    const newMovie = {
      title: response.Title,
      description: response.Plot,
      imgUrl: (response.Poster === 'N/A')
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : response.Poster,
      imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
      imdbId: response.imdbID,
    };

    setMovie(newMovie);
    setSearchButtonText('Search again');
    setIsLoading(false);
  }, [searchText, movie]);

  const handleAddMovie = useCallback(() => {
    if (movie !== null) {
      addMovie(movie);
    }

    setSearchText('');
    setSearchButtonText('Find a movie');
    setMovie(null);
  }, [movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitSearchHandler}
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
              value={searchText}
              onChange={searchTextHandler}
              placeholder="Enter a title to search"
              className="input is-dander"
            />
          </div>

          {notFound && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!searchText}
            >
              {searchButtonText}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
