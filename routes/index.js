const express = require('express');

const artistsRoute = require('./artists');
const feedbackRouter = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { artistsService } = params;

  router.get('/', async (req, res, next) => {
    // res.sendFile(path.join(__dirname, './static/index.html'));
    /* if (!req.session.visitcount) {
      req.session.visitcount = 0;
    }
    req.session.visitcount += 1;
    console.log(`Number of visits: ${req.session.visitcount}`);*/
    try {
      const artists = await artistsService.getList();
      const topProducts = await artistsService.getTopProducts();
      // pageTitle and template variables are set directly
      return res.render('layout', {
        pageTitle: 'Welcome',
        template: 'main',
        artists,
        topProducts,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/artists', artistsRoute(params));
  router.use('/feedback', feedbackRouter(params));
  return router; // return router object
};

// module.exports = router;
