#!/usr/bin/env bash

npx c8 --clean true node ./test/runTest.js
npx c8 --clean false node ./test_with_folder/runTest.js
npx c8 --clean false node ./e2etest/suite
