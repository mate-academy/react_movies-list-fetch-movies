import { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addNewMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [addedMovies, setAddedMovies] = useState<Movie[]>([]);
  const posterNotFoundUrl =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSearchMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const movieData = await getMovie(title);

      if ('Error' in movieData) {
        setError("Can't find a movie with such a title");
        setFoundMovie(null);
      } else {
        setFoundMovie({
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl:
            movieData.Poster !== 'N/A' ? movieData.Poster : posterNotFoundUrl, // Перевіряємо, якщо у фільма немає постера, то показуємо дефолтне фото
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        });
      }
    } catch (data) {
      setError("Can't find a movie with such a title");
      setFoundMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  // функція addMovie, викликається для додавання нового фільму і чистки стану компонента(форми)
  const addMovie = () => {
    // Перевіряємо, чи фільм який хочемо додати не повторюється(по imdbId) і тільки тоді додаємо його.
    if (
      foundMovie &&
      !addedMovies.some(movie => movie.imdbId === foundMovie.imdbId)
    ) {
      addNewMovie(foundMovie);
      setAddedMovies([...addedMovies, foundMovie]);
    }

    setError(null);
    setFoundMovie(null);
    setTitle(''); // Скидаємо введені дані в input
  };

  const handleInputMovie = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError(null); // Прибираємо помилку, якщо назву фільму введено вірно
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearchMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={title}
              id="movie-title"
              placeholder="Enter a title to search"
              className={error ? 'input is-danger' : 'input'}
              onChange={e => {
                handleInputMovie(e);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
              // Робить кнопку не активною до поки, не буде введене щось в Input(disabled + умова= title && ())
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!foundMovie}
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {foundMovie && !error && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {foundMovie && <MovieCard movie={foundMovie} />}
        </div>
      )}
    </>
  );
};
