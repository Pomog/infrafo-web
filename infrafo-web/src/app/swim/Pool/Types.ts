export type Point = { x: number; y: number };
export type Delta = { dx: number; dy: number; len: number };
export type UnitVector = { ux: number; uy: number };
export type MyVector = { vx: number; vy: number };
export type UnitDirection = { uVector: UnitVector; distance: number };

export const CATCH_EPS = 1e-1 as const;
export const ANG_EPS = 1e-9 as const;

export type StepResult =
    | { kind: "ok" }
    | { kind: "caught" }
    | { kind: "fled" };

export const OK: StepResult = {kind: "ok"};

export const CAUGHT: StepResult = {kind: "caught"};

export const FLED : StepResult = {kind: "fled"};

export const TIME_MARGIN: number = 0.02;