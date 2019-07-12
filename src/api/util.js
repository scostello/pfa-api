// @flow

const toBase64 = (string) =>
  Buffer.from(string).toString('base64');

const fromBase64 = (string) =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  toBase64,
  fromBase64,
};