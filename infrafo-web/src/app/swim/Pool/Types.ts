export type Point = { x: number; y: number };
export type Delta = { dx: number; dy: number; len: number };
export type UnitVector = { ux: number; uy: number };

export const CATCH_EPS = 1e-6 as const;

export type StepResult =
    | { kind: "ok" }
    | { kind: "caught" };


export const OK: StepResult = {kind: "ok"};

export const CAUGHT: StepResult = {kind: "caught"};