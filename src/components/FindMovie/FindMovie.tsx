import React, {
  ChangeEvent,
  useContext,
  useState,
} from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { DispatchContext, StateConstext } from '../../State/State';
import { checkMovie } from '../../services/movie';

const BASE_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=f7c94fc6';
const DEFOULT_POSTER
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const dispatch = useContext(DispatchContext);
  const { moviesList } = useContext(StateConstext);

  async function handleOnSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.length) {
      return;
    }

    setLoading(true);

    const queryTitle = `&t=${query.trim()}`;

    try {
      const response = await fetch(BASE_URL + queryTitle);
      const movieFromApi = await response.json();

      if (movieFromApi.Response === 'False') {
        setErrorMessage('Can\'t find a movie with such a title');
        setLoading(false);

        return;
      }

      const receivedMovie: Movie = {
        title: movieFromApi.Title,
        description: movieFromApi.Plot,
        imgUrl:
          movieFromApi.Poster === 'N/A'
            ? DEFOULT_POSTER
            : movieFromApi.Poster,
        imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}`,
        imdbId: movieFromApi.imdbID,
      };

      setMovie(receivedMovie);
      setQuery('');
    } catch (e: any) {
      setErrorMessage(e.message);
    }

    setLoading(false);
  }

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setErrorMessage('');
  }

  function addToList() {
    setLoading(true);
    if (!movie) {
      return;
    }

    if (!checkMovie(movie.imdbId, moviesList)) {
      dispatch({ type: 'addToList', payload: movie });
    }

    setLoading(false);
    setMovie(null);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleOnSubmit(event)}
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
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleOnChange}
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
              disabled={!query.length}
              data-cy="searchButton"
              type="submit"
              className={`button ${loading ? 'is-loading' : 'is-light'}`}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                onClick={addToList}
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
