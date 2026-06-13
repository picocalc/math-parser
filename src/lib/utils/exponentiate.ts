import { DivisionByZeroError } from "#lib/errors";

import { ZERO } from "./constants";
import { nthRoot } from "./nthroot";
import { simplify, toSimpleFraction } from "./simplify";
import { sqrt } from "./sqrt";
import { OverflowValue } from "./types";
import type { Value } from "./types";

export function exponentiate(
  left: Value,
  right: Value,
  precise: boolean,
): Value {
  const rN = right.n;
  const lN = left.n;

  if (rN === 0n) return { n: 1n, d: 1n };
  if (lN === "OVERFLOW") return left;

  const lD = left.d;
  const c = left.c;

  if (lN === lD && c === undefined) return { n: 1n, d: 1n };
  if (rN === "OVERFLOW") return right;

  const normalizedExponent = toSimpleFraction(simplify(right));
  let exponent = normalizedExponent.n;

  if (lN === 0n) {
    if (exponent < 0) throw new DivisionByZeroError();
    return ZERO;
  }

  const exp = (left.e ?? 1n) * exponent;

  let baseN = lN;
  let baseD = lD;

  if (exponent < 0) {
    exponent = -exponent;
    [baseN, baseD] = [baseD, baseN];
  }

  if (exponent > 1e4 && (baseN * exponent > 6e6 || baseD * exponent > 6e6)) {
    return OverflowValue;
  }

  const dExp = normalizedExponent.d;

  const e = c ? exp : undefined;

  if (exponent === dExp) {
    return { n: baseN, d: baseD, c, e };
  }

  const n = baseN ** exponent;
  const d = baseD ** exponent;

  const v = { n, d, c, e };

  if (dExp === 2n) {
    return sqrt(v, precise);
  }

  if (dExp !== 1n) {
    return nthRoot(v, dExp, precise);
  }

  return v;
}
