/* eslint-disable */
import React, { useEffect } from 'react';
import {
  Route,
  Link,
  Routes, HashRouter,
} from 'react-router-dom';
import classNames from 'classnames';
import { Favourites } from './components/Favourites/Favourites';
import { Search } from './components/Search/Search';
import { useLocalStorage } from './CustomHooks/useLocallStorage';

export const App: React.FC = () => {
  const [movies, setMovies] = useLocalStorage<Movie[]>('Movies', []);

  const [isFolderActive, setIsFolderActive] = useLocalStorage<boolean>('isFolderActive', true);

  const addMovie = (movie: Movie): void => {
    if (!movie) {
      return;
    }
    const includeMovie = movies.some(({ imdbID }) => movie.imdbID === imdbID);

    if (!includeMovie) {
      setMovies(currentMovies => [...currentMovies, movie]);
    }
  };

  const deleteMovie = (movie: Movie):void => {
    setMovies(currentMovies => currentMovies
      .filter(currentMovie => currentMovie.imdbID !== movie.imdbID));
  };

  useEffect(() => {setMovies(movies)}, [movies]);

  return (
    <HashRouter>
      <div className="box tabs is-centered is-toggle is-toggle-rounded">
        <ul>
          <li className={classNames({ 'is-active': isFolderActive })}>
            <Link to="favourites" onClick={() => setIsFolderActive(true)}>
              <span className="icon is-small"><i className="fa-solid fa-star" /></span>
              <span>Favourites</span>
            </Link>
          </li>
          <li className={classNames({ 'is-active': !isFolderActive })}>
            <Link to="search" onClick={() => setIsFolderActive(false)}>
              <span className="icon is-small"><i className="fa-solid fa-magnifying-glass" /></span>
              <span>Search</span>
            </Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route path="/favourites" element={<Favourites deleteMovie={deleteMovie} movies={movies} />} />
        <Route path="/search" element={<Search addMovie={addMovie} deleteMovie={deleteMovie} />} />
      </Routes>
    </HashRouter>
  );
};
