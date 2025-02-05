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

import { merge } from '../utils/object-utils';
import JDLEnumValue from './jdl-enum-value';

export default class JDLEnum {
  comment: any;
  name: any;
  values: Map<any, any>;

  constructor(args) {
    const merged = merge(defaults(), args);
    if (!merged.name) {
      throw new Error("The enum's name must be passed to create an enum.");
    }
    this.comment = merged.comment;
    this.name = merged.name;
    this.values = new Map(
      merged.values.map(entry => {
        return [entry.key, new JDLEnumValue(entry.key, entry.value, entry.comment)];
      })
    );
  }

  getValuesAsString() {
    return stringifyValues(this.values).join(',');
  }

  getValueJavadocs() {
    const javadocs = {};
    this.values.forEach(jdlEnumValue => {
      if (jdlEnumValue.comment) {
        javadocs[jdlEnumValue.name] = jdlEnumValue.comment;
      }
    });
    return javadocs;
  }

  toString() {
    let comment = '';
    if (this.comment) {
      comment += `/**\n * ${this.comment}\n */\n`;
    }
    const values = stringifyValues(this.values);
    return `${comment}enum ${this.name} {\n  ${values.join(',\n  ')}\n}`;
  }
}

function defaults() {
  return {
    values: [],
  };
}

function stringifyValues(jdlEnumValues) {
  const values: string[] = [];
  jdlEnumValues.forEach(jdlEnumValue => {
    values.push(jdlEnumValue.toString());
  });
  return values;
}
