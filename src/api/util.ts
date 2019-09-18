const toBase64 = (val: string) => Buffer.from(val).toString('base64');

const fromBase64 = (val: string) =>
  Buffer.from(val, 'base64').toString('ascii');

type Encode = (val: any) => string;

export const nodeToEdge = (encode: Encode) => node => ({
  node,
  cursor: encode(node.cursor)
});

export default {
  toBase64,
  fromBase64,
  nodeToEdge
};
