#!/usr/bin/env node

require('dotenv').config();

const program = require('commander');
const app = require('./src/cli');

app.initPrograms(program);

program.parse(process.argv);
