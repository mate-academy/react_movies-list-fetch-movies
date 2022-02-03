import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovieFromServer } from '../api/movies';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type AddMovie = (movieFromServer: Movie) => void;

interface Props {
  addMovie: AddMovie;
  moviesList: Movie[];
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie, moviesList } = props;
  const [input, setInput] = useState('');
  const [searchWasMade, setSearchWasMade] = useState(false);
  const [movieFromServer, setMovieFromServer] = useState<Movie>({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const findMovie = async (movieName: string) => {
    const movie = await getMovieFromServer(movieName);

    if (movie.Response === 'True') {
      setMovieFromServer(movie);
    } else {
      setMovieFromServer({
        Poster: '',
        Title: '',
        Plot: '',
        imdbID: '',
      });
    }

    setInput('');
    setSearchWasMade(true);
  };

  const handleAddToList = () => {
    addMovie(movieFromServer);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    findMovie(input);
  };

  const noMovieFound = !movieFromServer.Title && searchWasMade;
  const duplicate = moviesList.findIndex(movie => movie.imdbID === movieFromServer.imdbID);
  const cantAddToList = !movieFromServer.Title || duplicate >= 0;

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': noMovieFound })}
                value={input}
                onChange={handleInput}
              />
            </div>
          </label>

          {noMovieFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddToList}
              disabled={cantAddToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFromServer.Title
          ? <MovieCard movie={movieFromServer} />
          : <span>Please enter the movie title and press the find button</span>}
      </div>
    </>
  );
};
