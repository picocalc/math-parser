import type {
  NormalValue,
  ValueConstant,
  ValueExponent,
  PrecisionOptions,
} from "#lib/types";

function getConstantStr(coeff: bigint, c?: ValueConstant, e?: ValueExponent) {
  if (coeff === 0n) return "0";
  if (!c) return `${coeff}`;
  let constantStr: string = c;
  if (e) {
    const num = e.n;
    const den = e.d ?? 1n;
    if (num !== den) {
      const expStr = den === 1n ? `${num}` : `(${num}/${den})`;
      constantStr = den === 2n * num ? `sqrt(${c})` : `${c}^${expStr}`;
    }
  }
  if (coeff === 1n) return constantStr;
  if (coeff === -1n) return `-${constantStr}`;
  return `${coeff}${constantStr}`;
}

function formatPrecise(v: NormalValue): string {
  const { n, d, c, e } = v;
  if (n === 0n) return "0";
  const isNegative = n < 0;
  const absN = isNegative ? -n : n;
  const numSign = isNegative ? "-" : "";
  if (c && e && e.n < 0n) {
    const positiveExp = { n: -e.n, d: e.d };
    const denominatorStr = getConstantStr(d, c, positiveExp);
    return `${numSign}${absN}/${denominatorStr}`;
  }
  const numeratorStr = getConstantStr(absN, c, e);
  if (d === 1n) return `${numSign}${numeratorStr}`;
  return `${numSign}${numeratorStr}/${d}`;
}

/**
 * Converts Result to a Decimal or Fraction String.
 */
function formatResult(v: NormalValue, options: PrecisionOptions = {}): string {
  const { n, d } = v;

  if (options.format === "precise") return formatPrecise(v);

  const { maxDecimals = 30, roundingMode = "round" } = options;

  const isNegative = n < 0;

  const factor = 10n ** BigInt(maxDecimals);
  const absN = isNegative ? -n : n;

  const numerator = absN * factor;

  const roundOffset = roundingMode === "round" ? d / 2n : 0n;
  const shiftedResult = (numerator + roundOffset) / d;

  let resultStr = shiftedResult.toString();

  if (resultStr.length <= maxDecimals) {
    resultStr = resultStr.padStart(maxDecimals + 1, "0");
  }

  const splitIdx = resultStr.length - maxDecimals;
  const integerPart = resultStr.slice(0, splitIdx);
  const fractionalPart = resultStr.slice(splitIdx).replace(/0+$/, "");

  const finalResult = fractionalPart
    ? `${integerPart}.${fractionalPart}`
    : integerPart;

  return (isNegative && finalResult !== "0" ? "-" : "") + finalResult;
}

export { formatResult };
