import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [list, setList] = useState<MovieData[] >([]);
  const [film, setFilm] = useState<MovieData | null>(null);

  return (
    <div className="page">
      <div className="page-content">
        {
          list.length > 0
          && (<MoviesList list={list} />)
        }

      </div>

      <div className="sidebar">
        <FindMovie
          setFilm={setFilm}
          film={film}
          setList={setList}
          list={list}
        />
      </div>
    </div>
  );
};
