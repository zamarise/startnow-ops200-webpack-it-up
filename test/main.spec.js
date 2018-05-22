/* global define, it, describe, beforeEach, document */
const express = require('express');
const path = require('path');
const Nightmare = require('nightmare');
const expect = require('chai').expect;
const axios = require('axios');

let nightmare;

const app = express();
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.listen(8888);

const url = 'http://localhost:8888';


describe('webpack webpage', function () {
  this.timeout(6500);
  beforeEach(() => {
    nightmare = new Nightmare();
  });

  it('should load with status 200', () => axios.get(url)
    .then(response => expect(response.status === 200)));

  it('should render a div with react', () =>
    nightmare
      .goto(url)
      .wait('#root div')
      .evaluate(() => {
        const selector = '[data-reactroot], [data-reactid]';
        const runningReact = !!document.querySelector(selector);
        return !!runningReact;
      })
      .end()
      .then(text => expect(text).to.equal(true))
  );
});
