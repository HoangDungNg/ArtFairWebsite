/* eslint-disable arrow-body-style */
const fs = require('fs');
const util = require('util');

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching speakers information
 */
class SpeakerService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the speakers data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of speakers name and short name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map((speaker) => {
      return { name: speaker.name, shortname: speaker.shortname };
    });
  }

  /**
   * Get all artwork
   */
  async getAllProducts() {
    const data = await this.getData();

    // Array.reduce() is used to traverse all artists and
    // create an array that contains all artwork
    const products = data.reduce((acc, elm) => {
      if (elm.artwork) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);
    return products;
  }

  /**
   * Get all artwork of a given speaker
   * @param {*} shortname The speakers short name
   */
  async getProductForArtist(shortname) {
    const data = await this.getData();
    const artist = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!artist || !artist.artwork) return null;
    return artist.artwork;
  }

  /**
   * Get speaker information provided a shortname
   * @param {*} shortname
   */
  async getArtist(shortname) {
    const data = await this.getData();

    const artist = data.find((elm) => {
      return elm.shortname === shortname;
    });
    if (!artist) return null;
    return {
      title: artist.title,
      name: artist.name,
      shortname: artist.shortname,
      description: artist.description,
    };
  }

  /**
   * Returns a list of speakers with only the basic information
   */
  async getListShort() {
    const data = await this.getData();

    return data.map((artist) => {
      return {
        name: artist.name,
        shortname: artist.shortname,
        title: artist.title,
      };
    });
  }

  /**
   * Get a list of artists
   */
  async getList() {
    const data = await this.getData();
    return data.map((artist) => {
      return {
        name: artist.name,
        shortname: artist.shortname,
        summary: artist.summary,
      };
    });
  }

  /**
   * Get first product of each artist
   */

  async getTopProducts() {
    const topProducts = [];
    const data = await this.getData();
    data.forEach((ele) => {
      const splitData = ele.artwork[0].split('_');
      const temp = `${splitData[0]}_${splitData[1]}_${splitData[2]}.jpg`;
      topProducts.push(temp);
    });
    return topProducts;
  }

  /**
   * Fetches speakers data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data).artists;
  }
}

module.exports = SpeakerService;
