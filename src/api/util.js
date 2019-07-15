// @flow

const toBase64 = (val: string) => Buffer.from(val).toString('base64');

const fromBase64 = (val: string) => Buffer.from(val, 'base64').toString('ascii');

export default {
  toBase64,
  fromBase64,
};
