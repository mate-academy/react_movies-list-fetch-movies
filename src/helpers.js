const API_URL = 'http://www.omdbapi.com/';
const API_KEY = '91441aae';

export const request = title => fetch(`${API_URL}?apikey=${API_KEY}&t=${title}`)
  .then(response => response.json());
