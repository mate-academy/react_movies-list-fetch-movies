import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { normalizeNewMovie } from '../../services/movieService';
import { TextInput } from '../TextInput';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [state, setState] = useState({
    query: '',
    movie: null as Movie | null,
    error: false,
    isLoading: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setState(prevState => ({ ...prevState, query: value, error: false }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const response = await getMovie(state.query);

      if ('Error' in response) {
        setState(prevState => ({ ...prevState, error: true }));
      } else {
        const movie = normalizeNewMovie(response);

        setState(prevState => ({ ...prevState, movie }));
      }
    } finally {
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const handleAddMovie = () => {
    if (state.movie) {
      onAdd(state.movie);
      setState({
        query: '', movie: null, error: false, isLoading: false,
      });
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <TextInput
          data-cy="titleField"
          label="Movie title"
          id="movie-title"
          value={state.query}
          placeholder="Enter a movie title"
          onChange={handleChange}
          error={state.error}
          errorMessage="Could not find a movie with that title"
        />
        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': state.isLoading,
              })}
              disabled={!state.query.trim()}
            >
              Search
            </button>
          </div>
          {state.movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </form>
      {state.movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={state.movie} />
        </div>
      )}
    </>
  );
};
