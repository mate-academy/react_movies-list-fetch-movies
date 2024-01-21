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

    const queryTitle = `&t=${query}`;

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
        imgUrl: movieFromApi.Poster || DEFOULT_POSTER,
        imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}/`,
        imdbId: movieFromApi.imdbID,
      };

      setMovie(receivedMovie);
      setQuery('');
      setLoading(false);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value.trim());
    setErrorMessage('');
  }

  function addToList() {
    if (!movie) {
      return;
    }

    if (!checkMovie(movie.imdbId, moviesList)) {
      dispatch({ type: 'addToList', payload: movie });
      setMovie(null);
    } else {
      setErrorMessage('This movie already exist in the list...');
    }
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

          <div className="control">
            <button
              disabled={!movie}
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard movie={movie} />)}
      </div>
    </>
  );
};
