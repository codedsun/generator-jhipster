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
/**
 * Removes server files that where generated in previous JHipster versions and therefore
 * need to be removed.
 *
 * @param {any} generator - reference to generator
 * @param {string} javaDir - Java directory
 * @param {string} testDir - Java tests directory
 * @param {string} mainResourceDir - Main resources directory
 * @param {string} testResourceDir - Test resources directory
 */
export default function cleanupOldServerFiles(generator, javaDir, testDir, mainResourceDir, testResourceDir) {
  const rootTestDir = generator.TEST_DIR;
  if (generator.isJhipsterVersionLessThan('7.4.2')) {
    generator.removeFile(`${testResourceDir}cucumber.properties`);
    generator.removeFile(`${rootTestDir}features/gitkeep`);
    generator.removeFile(`${rootTestDir}features/user/user.feature`);
  }
}
