import React from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends React.Component<{}, State> {
  state: State = {
    movies: [],
  };

  onAddMovie = (movieAdd: Movie) => {
    const { movies } = this.state;
    const Dublicate = movies.find(movie => movie.imdbID === movieAdd.imdbID);

    if (Dublicate) {
      this.setState(state => ({
        movies: [
          ...state.movies,
          movieAdd,
        ],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAddMovie={this.onAddMovie} />
        </div>
      </div>
    );
  }
}
