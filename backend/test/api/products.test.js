const expect = require('chai').expect;
const request = require('supertest')
const basicSetup = require('../helper/basicSetup')
const fs = require('fs');
const {unlink, writeFile} = require('fs').promises
const app = require('../../app');
const path = require('path')
const seeder = require('../../utils/seeder');
const Product = require('../../models/product')
const productData = require('../../data/productTest.json')


// seeder(Product, productData)

const readFileOtp = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      };
      resolve(data)
    });

  })
}

describe('', () => {










})