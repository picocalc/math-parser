import { DivisionByZeroError } from "#lib/errors";

import { ZERO } from "./constants";
import { nthRoot } from "./nthroot";
import { simplify } from "./simplify";
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
  const lC = left.c;

  if (lN === lD && lC === undefined) return { n: 1n, d: 1n };

  if (rN === "OVERFLOW") return right;

  const normalizedExponent = simplify(right);

  let exponent = normalizedExponent.n;

  if (lN === 0n) {
    if (exponent < 0) throw new DivisionByZeroError();
    return ZERO;
  }

  const exponentD = normalizedExponent.d;

  const lE = left.e ?? 1n;
  const exp = lE * exponent;

  if (exponentD === 2n) {
    const basePowerN = lN ** exponent;
    const basePowerD = lD ** exponent;

    const rootResult = sqrt(
      { n: basePowerN, d: basePowerD, c: lC, e: lC ? exp : undefined },
      precise,
    );

    return rootResult;
  }

  let baseN = lN;
  let baseD = lD;

  if (exponent < 0) {
    [baseN, baseD] = [baseD, baseN];
  }

  if (exponentD !== 1n) {
    if (exponent < 0) {
      exponent = -exponent;
    }
    const basePowerN = baseN ** exponent;
    const basePowerD = baseD ** exponent;

    const rootResult = nthRoot(
      { n: basePowerN, d: basePowerD, c: lC, e: lC ? exp : undefined },
      exponentD,
      precise,
    );

    return rootResult;
  }

  // Handling negative exponents: flip the fraction and make exponent positive
  if (exponent < 0) {
    exponent = -exponent;
    if (lC !== undefined) {
      return { n: baseN ** exponent, d: baseD ** exponent, c: lC, e: exp };
    }
  }

  if (exponent === 1n) {
    let c, e;
    if (normalizedExponent.c === undefined) {
      c = lC;
      e = left.e;
    }
    return { n: baseN, d: baseD, c, e };
  }

  if (exponent > 1e4 && (baseN * exponent > 6e6 || baseD * exponent > 6e6)) {
    return OverflowValue;
  }

  const n = baseN ** exponent;
  const d = baseD ** exponent;

  if (!lC) {
    return { n, d };
  }

  return { n, d, c: lC, e: exp };
}
