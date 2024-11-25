export const corsConfig = {
    development: {
      origin: ['http://localhost:4200', 'https://ticketsqradmin.novabites.cl'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    },
    production: {
      origin: ['https://ticketsqradmin.novabites.cl'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }
  };