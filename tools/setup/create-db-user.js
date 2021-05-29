#!/usr/bin/env node
"use strict";

/**
 * Create datababse users
 * 
 * mongo mongodb://myroot:root000@127.0.0.1:27017/ --eval "db.getSiblingDB('strapi').createUser({ user:'strapi', pwd: 'strapi', roles: [{ role:'readWrite', db:'strapi' }] });"
 */

//
// load .env
//
process.env.NODE_ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: require("fs").existsSync(`.env.${process.env.NODE_ENV}.local`)
    ? `.env.${process.env.NODE_ENV}.local`
    : require("fs").existsSync(`.env.${process.env.NODE_ENV}`)
    ? `.env.${process.env.NODE_ENV}` : '.env',
});

const { spawn } = require('child_process');

const ADMIN_USER='myroot';
const ADMIN_PASS='myroot000';

const options = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
};

function onChildProcessExit(child) {
  return new Promise((resolve, reject) => {
    child.once('exit', (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error('Exit with error, ' + code));
    });

    child.once('error', err => {
      reject(err);
    });
  });
}

( async ({options}) => {
  let child;

  // connection test
  try {
    // try to connect with the user
    const url = `mongodb://${options.DB_USER}:${options.DB_PASS}@${options.DB_HOST||'127.0.0.1'}:${options.DB_PORT||27017}/${options.DB_NAME}`;
    console.log(">>> connection url:", url);
    child = spawn('mongo', [
      url,
      '--eval', `db.getCollectionNames()`
    ], {
      stdio: [process.stdin, process.stdout, process.stderr]
    });
    await onChildProcessExit(child);
    // done
    return;
  } catch (e) {
    console.error(e.message);
    console.log(">>> Creating user...");
  } finally {
    if (child && !child.killed) {
      child.kill();
    }
  }
  // failed to connect to the database
  // create users
  try {
    const url = `mongodb://${ADMIN_USER}:${ADMIN_PASS}@${options.DB_HOST||'127.0.0.1'}:${options.DB_PORT||27017}/`;
    child = spawn('mongo', [
      url,
      '--eval', 
      `db.getSiblingDB('${options.DB_NAME}').createUser({ user:'${options.DB_USER}', pwd: '${options.DB_PASS}', roles: [{ role:'readWrite', db:'${options.DB_NAME}' }] });`
    ], {
      //stdio: ['pipe', 'pipe', 'pipe'] // stdin, stdout, stderr
      stdio: [process.stdin, process.stdout, process.stderr]
    });

    await onChildProcessExit(child);
  } catch (e) {
    console.error(e);
  } finally {
    if (child && !child.killed) {
      child.kill();
    }
  }

})({options});
