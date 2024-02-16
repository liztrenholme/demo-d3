import 'whatwg-fetch';
import API from './env';

export const getData = async (page) => {
  console.log('page is...', page);
  const url = `https://free-nba.p.rapidapi.com/teams?page=${page}`;

  let data = {};
  try {
    data = await fetch(url, {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'free-nba.p.rapidapi.com',
        'x-rapidapi-key': API.API_KEY
      }
    })
      .then(blob => blob.json());
    console.log('data...', data);
    return(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e, 'Error fetching data');
    return(e);
  }
};