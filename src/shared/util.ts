interface TranslateBase64 {
  readonly toBase64: (val: string) => string;
  readonly fromBase64: (val: string) => string;
}

const Util: TranslateBase64 = {
  toBase64: (val: string) => Buffer.from(val).toString('base64'),
  fromBase64: (val: string) => Buffer.from(val, 'base64').toString('ascii'),
};

export { Util };
