/* eslint-disable max-len */
const OMDB_URL = 'https://www.omdbapi.com/?apikey=87aae092&t=';

async function request(url) {
  const response = await fetch(`${OMDB_URL}${url}`);

  if (!response.ok) {
    throw new Error(`${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export function getMovie(title) {
  return request(title);
}

export const defaultMovies = [
  {
    Title: 'Inception',
    Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    imdbID: 'tt1375666',
    Year: '2010',
    imdbRating: '8.8',
  },
  {
    Title: 'Love Actually',
    Plot: `Follows the lives of eight very different couples in dealing with their love lives in various loosely interrelated tales all set during a frantic month before Christmas in London, England.`,
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTY4NjQ5NDc0Nl5BMl5BanBnXkFtZTYwNjk5NDM3._V1_.jpg',
    imdbID: 'tt0314331',
    Year: '2003',
    imdbRating: '7.6',
  },
  {
    Title: 'The Day After Tomorrow',
    Plot: 'Jack Hall, paleoclimatologist, must make a daring trek from Washington, D.C. to New York City to reach his son, trapped in the cross-hairs of a sudden international storm which plunges the planet into a new Ice Age.',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTY4YWMzMTMtZjUyOS00OGY1LTljMGUtOWU5ZjYzMjc2ZTMwXkEyXkFqcGdeQXVyMTYzMDM0NTU@._V1_SY1000_CR0,0,701,1000_AL_.jpg',
    imdbID: 'tt0319262',
    Year: '2004',
    imdbRating: '6.4',
  },
  {
    Title: 'Rogue One',
    Plot: 'The daughter of an Imperial scientist joins the Rebel Alliance in a risky move to steal the Death Star plans.',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SY1000_SX675_AL_.jpg',
    imdbID: 'tt3748528',
    Year: '2016',
    imdbRating: '7.8',
  },
  {
    Title: 'The Holiday',
    Plot: "Two women troubled with guy-problems swap homes in each other's countries, where they each meet a local guy and fall in love.",
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTI1MDk4MzA2OF5BMl5BanBnXkFtZTYwMjQ3NDc3._V1_.jpg',
    imdbID: 'tt0457939',
    Year: '2006',
    imdbRating: '6.9',
  },
];
