// @flow

import Relationship from '../Relationship';
import Model from '../Model';

export default class HasOne<T> extends Relationship<T> {
  setup() {
    return `${this.originModel.pluralPath}/${this.instance.identifier}/${this.foreignModel.singularPath}`;
  }

  // async create(data: Object): Promise<T> {}
}
