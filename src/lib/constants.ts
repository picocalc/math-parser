const PI: string = Math.PI.toString();
const E: string = Math.E.toString();

const constants: {
  readonly e: typeof E;
  readonly pi: typeof PI;
} = {
  e: E,
  pi: PI,
} as const;

export { constants, PI, E };
