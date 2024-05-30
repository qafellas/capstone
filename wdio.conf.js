import ApiUtil from "./test/utils/api.js";
import path from "path";
import fs from "fs";
import mergeResults from '@wdio/json-reporter/mergeResults'
import allure from 'allure-commandline'

export const config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: "local",

  specs: [
    "./test/specs/1-login.spec.js",
    "./test/specs/2-contacts.spec.js"
  ],
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],

  maxInstances: 1,

  capabilities: [
    {
      browserName: "chrome",
      browserVersion: '124.0.6367.209',
      "goog:chromeOptions": {
        args: [
          "--headless",
          "--start-maximized",
          "--ignore-certificate-errors",
          "--incognito",
        ],
      },
    },
    // , {
    //     browserName: 'firefox'
    // }, {
    //     browserName: 'MicrosoftEdge'
    // }
  ],


  logLevel: "error",

  bail: 0,

  // Default timeout for all waitFor* commands.
  waitforTimeout: 10000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  //
  // Default request retries count
  connectionRetryCount: 3,

  framework: "mocha",

  reporters: [
    "spec",
    [
      "json",
      {
        outputDir: "./output/jsonReporter",
        outputFileFormat: function (opts) {
          return `results-${opts.cid}.${opts.capabilities}.json`;
        },
      },
    ],
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],

  ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

  // beforeSession: function (config, capabilities, specs, cid) {
  // },

  before: async function () {
    await ApiUtil.addUser();
  },

  // beforeSuite: function (suite) {
  // },

  // beforeTest: function (test, context) {
  // },

  // beforeHook: function (test, context, hookName) {
  // },

  // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
  // },

  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (error) {
      await browser.takeScreenshot();
    }
  },


  // afterSuite: function (suite) {
  // },

  after: async function () {
    await ApiUtil.deleteUser();
  },
  onComplete: function () {
    mergeResults("./output/jsonReporter", "results-*", "test-results.json");
    const reportError = new Error('Could not generate Allure report')
    const generation = spawn('allure', ['generate', 'allure-results', '--clean']);

    return new Promise((resolve, reject) => {
      const generationTimeout = setTimeout(() => {
        console.error('Allure report generation timed out');
        reject(reportError);
      }, 5000);

      generation.on('error', (err) => {
        clearTimeout(generationTimeout);
        console.error('Error during Allure report generation:', err);
        reject(reportError);
      });

      generation.on('exit', (exitCode) => {
        clearTimeout(generationTimeout);

        if (exitCode !== 0) {
          console.error('Allure report generation failed with exit code:', exitCode);
          return reject(reportError);
        }

        console.log('Allure report successfully generated');
        resolve();
      });
    });
  },

};
