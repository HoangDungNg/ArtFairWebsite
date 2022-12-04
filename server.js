/* eslint-disable arrow-body-style */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const FeedbackService = require('./services/FeedbackService');
const ArtistsService = require('./services/ArtistService');

const feedbackService = new FeedbackService('./data/feedback.json');
const artistsService = new ArtistsService('./data/artists.json');

const routes = require('./routes');

const app = express();
const port = 3500;

// this is to make the express to trust cookies
// cookieSession may fail without this line
app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['adfaee5555', 'ajujshdopp888'],
  })
);

// for reading data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// this is template variable
app.locals.siteName = 'Art Fair';

app.use(express.static(path.join(__dirname, '/static')));

// throw can cause the app to be crashed
// *never throw from express routes

/* app.get('/throw', (req, res, next) => {
  setTimeout(() => {
    // throw new Error('Something did throw!');
    return next(new Error('Something did throw!'));
  }, 500);
});*/

// this is a custom middleware
app.use(async (req, res, next) => {
  try {
    const names = await artistsService.getNames();
    res.locals.artistNames = names;
    // console.log(res.locals);
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    artistsService,
  })
);

// this middleware creates an error for undefined routes
// run npm install http-errors
app.use((req, res, next) => {
  return next(createError(404, 'File not found'));
});

// this is handling errors middleware
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err); // this displays the exact error for developers without leaking info to users
  const status = err.status || 500; // 500 indicates internal errors
  res.locals.status = status;
  res.status(status);
  res.render('error');
});
app.listen(port, () => {
  console.log(`Server lisening on port ${port}`);
});
