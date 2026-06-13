import type { NormalValue, ValueConstant } from "./utils/types";

const PI: string = Math.PI.toString();
const E: string = Math.E.toString();

const constants: {
  readonly e: typeof E;
  readonly pi: typeof PI;
} = {
  e: E,
  pi: PI,
} as const;

function getConst(id: ValueConstant): NormalValue {
  const c = constants[id];
  return {
    n: BigInt(c.replace(".", "")),
    d: 10n ** BigInt(c.length - c.indexOf(".") - 1),
  };
}

export { getConst, constants, PI, E };
