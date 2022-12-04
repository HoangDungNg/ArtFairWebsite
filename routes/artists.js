/* eslint-disable arrow-body-style */
const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { artistsService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const artists = await artistsService.getList();
      const allProducts = await artistsService.getAllProducts();

      // variables passed to res.render are local variables
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        artists,
        allProducts,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const artist = await artistsService.getArtist(req.params.shortname);
      const allProducts = await artistsService.getProductForArtist(req.params.shortname);
      // console.log(speaker);
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        artist,
        allProducts,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
