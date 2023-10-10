export  function generateMD5Hash(input: string): string {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >>> 16) + (y >>> 16) + (lsw >>> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function md5(input: Uint8Array): string {
    const r = new Array(64);
    const k = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
    ];

    const blocks: number[][] = [];
    let i = 0;
    for (; i < input.length - 64; i += 64) {
      blocks.push(Array.from(input.slice(i, i + 64)));
    }

    let lastBlock = Array.from(input.slice(i));
    const bitLen = input.length * 8;

    lastBlock.push(0x80);

    if (lastBlock.length > 56) {
      while (lastBlock.length < 64) {
        lastBlock.push(0x00);
      }
      blocks.push(lastBlock);
      lastBlock = new Array(64).fill(0x00);
    }

    while (lastBlock.length < 56) {
      lastBlock.push(0x00);
    }

    for (let i = 0; i < 8; i++) {
      lastBlock[lastBlock.length - 8 + i] = (bitLen >>> (i * 8)) & 0xFF;
    }
    blocks.push(lastBlock);

    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;

    for (const block of blocks) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) {
        w[i] = (block[i * 4] << 24) | (block[i * 4 + 1] << 16) | (block[i * 4 + 2] << 8) | (block[i * 4 + 3]);
      }

      for (let i = 16; i < 64; i++) {
        const s0 = rotateLeft(w[i - 15], 7) ^ rotateLeft(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotateLeft(w[i - 2], 17) ^ rotateLeft(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = addUnsigned(addUnsigned(w[i - 16], s0), addUnsigned(w[i - 7], s1));
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let f, g;

      for (let i = 0; i < 64; i++) {
        if (i < 16) {
          f = (b & c) | ((~b) & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | ((~d) & c);
          g = (5 * i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3 * i + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7 * i) % 16;
        }

        const temp = d;
        d = c;
        c = b;
        b = addUnsigned(b, rotateLeft(addUnsigned(a, addUnsigned(f, addUnsigned(k[i], w[g]))), r[i]));
        a = temp;
      }

      h0 = addUnsigned(h0, a);
      h1 = addUnsigned(h1, b);
      h2 = addUnsigned(h2, c);
      h3 = addUnsigned(h3, d);
    }

    const hex = (n: number) => (n < 16 ? '0' : '') + n.toString(16);
    return hex(h0) + hex(h1) + hex(h2) + hex(h3);
  }

  const byteArray = new Uint8Array(input.length);
  for (let i = 0; i < input.length; i++) {
    byteArray[i] = input.charCodeAt(i) & 0xFF;
  }

  return md5(byteArray);
}

export function hexToDecimal(hex: string): number {
  return parseInt(hex, 16);
}

export function md5HexToDecimalList(md5Hex: string): number[] {
  const decimalList: number[] = [];

  for (let i = 0; i < md5Hex.length; i += 2) {
    const hexPair = md5Hex.substr(i, 2);
    const decimalValue = hexToDecimal(hexPair);
    decimalList.push(decimalValue);
  }

  return decimalList;
}