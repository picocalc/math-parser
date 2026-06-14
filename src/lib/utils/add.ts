import { gcd } from "./gcd";
import type { Value } from "./types";

export function add(
  left: Value,
  right: Value,
  subtract: boolean = false,
): Value {
  const lN = left.n;
  if (lN === "OVERFLOW") return left;
  const rN = right.n;
  if (rN === "OVERFLOW") return right;

  const rD = right.d;
  const rC = right.c;
  const rE = right.e;

  if (lN === 0n) return { n: subtract ? -rN : rN, d: rD, c: rC, e: rE };

  const lD = left.d;
  const lC = left.c;
  const lE = left.e;

  if (rN === 0n) return { n: lN, d: lD, c: lC, e: lE };

  let n, d, c, e;

  if (lD === rD) {
    n = subtract ? lN - rN : lN + rN;
    d = lD;
  } else {
    const common = gcd(lD, rD);
    if (common === 1n) {
      n = subtract ? lN * rD - rN * lD : lN * rD + rN * lD;
      d = lD * rD;
    } else {
      const mLeft = rD / common;
      const mRight = lD / common;
      n = subtract ? lN * mLeft - rN * mRight : lN * mLeft + rN * mRight;
      d = lD * mLeft;
    }
  }
  if (lC === rC && n !== 0n) {
    c = lC;
    if (lE?.n === rE?.n) {
      e = lE;
    }
  }
  return { n, d, c, e };
}
