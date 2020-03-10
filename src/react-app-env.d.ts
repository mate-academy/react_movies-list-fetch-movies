interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

type Movies = Movie[];

interface MovieFromServer {
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
  Response: string;
}
