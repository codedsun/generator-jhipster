/**
 * Copyright 2013-2022 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import assert from 'assert/strict';
import { jestExpect as expect } from 'mocha-expect-snapshot';
import lodash from 'lodash';
import { basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';

import testSupport from '../../test/support/index.cjs';
import { defaultHelpers as helpers } from '../../test/utils/utils.mjs';
import Generator from './index.mjs';
import { shouldComposeWithKafka } from './__test-support/index.mjs';

const { snakeCase } = lodash;
const { testBlueprintSupport } = testSupport;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generator = basename(__dirname);
const generatorPath = join(__dirname, 'index.mjs');

const serverGenerators = ['jhipster:common', 'jhipster:maven', 'jhipster:gradle', 'jhipster:kafka'];
const skipPriorities = ['prompting', 'writing', 'postWriting', 'writingEntities', 'postWritingEntities'];

describe(`JHipster ${generator} generator`, () => {
  it('generator-list constant matches folder name', async () => {
    await expect((await import('../generator-list.mjs'))[`GENERATOR_${snakeCase(generator).toUpperCase()}`]).toBe(generator);
  });
  it('should support features parameter', () => {
    const instance = new Generator([], { help: true, env: { cwd: 'foo', sharedOptions: { sharedData: {} } } }, { bar: true });
    expect(instance.features.bar).toBe(true);
  });
  describe('blueprint support', () => testBlueprintSupport(generator));

  describe('composing', () => {
    describe('buildTool option', () => {
      describe('maven', () => {
        let runResult;
        before(async () => {
          runResult = await helpers
            .run(generatorPath)
            .withOptions({
              localConfig: {
                baseName: 'jhipster',
                buildTool: 'maven',
              },
              skipPriorities,
            })
            .withMockedGenerators(serverGenerators);
        });

        it('should compose with maven generator', () => {
          assert(runResult.mockedGenerators['jhipster:maven'].calledOnce);
        });
        it('should not compose with others buildTool generators', () => {
          assert(runResult.mockedGenerators['jhipster:gradle'].notCalled);
        });
      });
      describe('gradle', () => {
        let runResult;
        before(async () => {
          runResult = await helpers
            .run(generatorPath)
            .withOptions({
              localConfig: {
                baseName: 'jhipster',
                buildTool: 'gradle',
              },
              skipPriorities,
            })
            .withMockedGenerators(serverGenerators);
        });

        it('should compose with gradle generator', () => {
          assert(runResult.mockedGenerators['jhipster:gradle'].calledOnce);
        });
        it('should not compose with others buildTool generators', () => {
          assert(runResult.mockedGenerators['jhipster:maven'].notCalled);
        });
      });
    });

    describe('messageBroker option', () => {
      describe('no', () => {
        let runResult;
        before(async () => {
          runResult = await helpers
            .run(generatorPath)
            .withOptions({
              localConfig: {
                baseName: 'jhipster',
                messageBroker: 'no',
              },
              skipPriorities,
            })
            .withMockedGenerators(serverGenerators);
        });

        shouldComposeWithKafka(false, () => runResult);
      });
      describe('kafka', () => {
        let runResult;
        before(async () => {
          runResult = await helpers
            .run(generatorPath)
            .withOptions({
              localConfig: {
                baseName: 'jhipster',
                messageBroker: 'kafka',
              },
              skipPriorities,
            })
            .withMockedGenerators(serverGenerators);
        });
        shouldComposeWithKafka(true, () => runResult);
      });
    });
  });
});
