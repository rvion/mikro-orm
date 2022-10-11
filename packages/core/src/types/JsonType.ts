import { Type } from './Type';
import type { Platform } from '../platforms';
import type { EntityProperty } from '../typings';
import { Utils } from '../utils';
import { stableStringify } from '../utils/stableStringify';

export class JsonType extends Type<unknown, string | null> {

  constructor(
    private opts: { useStableStringify?: boolean } = {},
  ) {
    super();
  }

  convertToDatabaseValue(value: unknown, platform: Platform): string | null {
    if (platform.convertsJsonAutomatically(true) || value === null) {
      return value as string;
    }

    if (this.opts.useStableStringify) {
      return stableStringify(value);
    }
    return JSON.stringify(value);
  }

  convertToJSValue(value: string | unknown, platform: Platform): unknown {
    if (!platform.convertsJsonAutomatically() && Utils.isString(value)) {
      return JSON.parse(value);
    }

    return value;
  }

  getColumnType(prop: EntityProperty, platform: Platform): string {
    return platform.getJsonDeclarationSQL();
  }

}
