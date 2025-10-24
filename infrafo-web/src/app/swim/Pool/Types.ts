export type Point = { x: number; y: number };
export type Delta = { dx: number; dy: number; len: number };
export type UnitVector = { ux: number; uy: number };
export type MyVector = { vx: number; vy: number };
export type UnitDirection = { uVector: UnitVector; distance: number };

export const CATCH_EPS = 1e-1 as const;
export const ANG_EPS = 1e-9 as const;

export const MIN_LEN = 1e-9 as const;
const SAFETY = 1e-6;
export const MARGIN = 1e-2;
export const ANG_DEAD = 1e-1;

export const MAX_RATIO_VT_VR = 5;

export type SwimmerStateName = 'BuildGap' | 'Dash' | 'Curl' | 'MoveAway';

export const DASH_LIMIT: number = 0.1;
export const OVER_COACH: number = 1.1;


export type StepResult =
    | { kind: "ok" }
    | { kind: "caught" }
    | { kind: "fled" };

export const OK: StepResult = {kind: "ok"};

export const CAUGHT: StepResult = {kind: "caught"};

export const FLED : StepResult = {kind: "fled"};

export type SwimmerMode = "orbit" | "dash";

export type StateName = 'BuildGap' | 'DashOut';

export type Polar = {
    r: number;
    theta: number;
    vr: UnitVector;
    vt: UnitVector;
};

export type VelComponents = {
    vr: number;
    vt: number;
    mode: "orbit" | "dash";
};