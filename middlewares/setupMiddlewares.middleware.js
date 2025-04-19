const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const setupMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

module.exports = setupMiddlewares;
