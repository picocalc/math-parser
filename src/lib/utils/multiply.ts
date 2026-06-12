import { gcd } from "./gcd";
import type { NormalValue, Value, ValueConstant } from "./types";

export function multiply<V extends Value>(a: V, b: V): V | NormalValue {
  const aN = a.n;
  const bN = b.n;

  if (aN === 0n || bN === 0n) {
    return { n: 0n, d: 1n };
  }

  if (aN === "OVERFLOW") return a;
  if (bN === "OVERFLOW") return b;

  let n: bigint;
  let d: bigint;
  let c: ValueConstant | undefined;
  let e: bigint | undefined;

  if (a.d === 1n && b.d === 1n) {
    n = aN * bN;
    d = 1n;
  } else {
    const g1 = gcd(aN, b.d);
    const g2 = gcd(bN, a.d);
    n = (aN / g1) * (bN / g2);
    d = (a.d / g2) * (b.d / g1);
  }

  if (a.c === undefined && b.c !== undefined) {
    c = b.c;
  } else if (a.c !== undefined && b.c === undefined) {
    c = a.c;
  } else if (a.c === b.c) {
    c = a.c;
  }

  if (a.e !== undefined && b.e !== undefined) {
    e = a.e + b.e;
  } else if (a.e !== undefined && b.e === undefined) {
    e = a.e;
  } else if (b.e !== undefined && a.e === undefined) {
    e = b.e;
  } else if (a.c === b.c) {
    e = (a.e ?? 1n) + (b.e ?? 1n);
  }

  return { n, d, c, e };
}
