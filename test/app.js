'use strict';

const fs = require('fs'),
  path = require('path'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  Sequelize = require('sequelize'),
  models = require('../app/models'),
  dataCreation = require('./../app/models/scripts/dataCreation');

chai.use(chaiHttp);

beforeEach('drop tables, re-create them and populate sample data', done => {
  const promises = Object.keys(models)
    .filter(modelName => modelName !== 'sequelize' && modelName !== 'Sequelize')
    .map(modelName => models[modelName].destroy({ force: true, where: {} }));
  Promise.all(promises)
    .then(() => dataCreation.execute())
    .then(() => done());
});

const normalizedPath = path.join(__dirname, '.');
fs.readdirSync(normalizedPath).forEach((file) => {
  if (fs.lstatSync(`${normalizedPath}/${file}`).isDirectory()) {
    fs.readdirSync(`${normalizedPath}/${file}`).forEach((inFile) => {
      require(`./${file}/${inFile}`);
    });
  } else {
    require(`./${file}`);
  }
});