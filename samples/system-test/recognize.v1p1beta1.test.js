/**
 * Copyright 2016, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const path = require(`path`);
const {Storage} = require(`@google-cloud/storage`);
const assert = require(`assert`);
const uuid = require(`uuid`);
const {runAsync} = require(`@google-cloud/nodejs-repo-tools`);
const storage = new Storage();
const bucketName = `nodejs-docs-samples-test-${uuid.v4()}`;
const cmd = `node recognize.v1p1beta1.js`;
const cwd = path.join(__dirname, `..`);
const filename1 = `Google_Gnome.wav`;
const filename2 = `commercial_mono.wav`;
const filepath1 = path.join(__dirname, `../resources/${filename1}`);
const filepath2 = path.join(__dirname, `../resources/${filename2}`);

const text = `Chrome`;

describe(`Recognize v1p1beta1`, () => {
  before(async () => {
    const [bucket] = await storage.createBucket(bucketName);
    await bucket.upload(filepath1);
  });

  after(async () => {
    const bucket = storage.bucket(bucketName);
    await bucket.deleteFiles({force: true});
    await bucket.deleteFiles({force: true}); // Try a second time...
    await bucket.delete();
  });

  it(`should run sync recognize with metadata`, async () => {
    const output = await runAsync(`${cmd} sync-metadata ${filepath2}`, cwd);
    assert.ok(output.includes(text));
  });
});
