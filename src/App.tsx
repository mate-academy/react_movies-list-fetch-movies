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
    const { movies } = this.state;

    if (movies.every(film => film.imdbID !== movie.imdbID)) {
      this.setState(prevState => ({
        movies: [...prevState.movies, movie],
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
          <FindMovie onAddMovie={this.onAdd} />
        </div>
      </div>
    );
  }
}
