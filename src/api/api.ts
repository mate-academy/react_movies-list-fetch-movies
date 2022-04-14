// https://www.omdbapi.com/?apikey=[yourkey]&t=[title]

const API_KEY = '4fb96ef5';
const URL = 'https://www.omdbapi.com/';

export const request = (title: string) => fetch(`${URL}?apikey=${API_KEY}&t=${title}`)
  .then((response) => response.json());
