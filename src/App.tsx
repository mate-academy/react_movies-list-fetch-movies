import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: [],
  };

  onAdd = (movie: Movie) => {
    this.setState(state => {
      const isExists = state.movies.some(film => movie.imdbID === film.imdbID);

      if (isExists) {
        return null;
      }

      return {
        movies: [...state.movies, movie],
      };
    });
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAdd={this.onAdd} />
        </div>
      </div>
    );
  }
}
