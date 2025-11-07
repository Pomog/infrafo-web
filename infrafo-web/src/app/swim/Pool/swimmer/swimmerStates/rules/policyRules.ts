import {DASH_LIMIT, SwimmerStateName} from "@/app/swim/Pool/Types";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";

export type RuleContext = {
    current: SwimmerStateName;
    swimmer: SwimmerV4;
    coach: Actor;
    ratio: number;  // r/R -> normalizedDistanceFromCenter
    opposite: boolean; // isOppositeThroughCenter
    dist: number;
    nearCatch: boolean;
    cannotMatchOmega: boolean; // |ω|*r >= v_swimmer or not finite
};
export type StateRule = (ctx: RuleContext) => SwimmerStateName | null;

export const ruleDashIfOppositeAndReady: StateRule = ({opposite, ratio}) =>
    (opposite && ratio > DASH_LIMIT ? "Dash" : null);

export const ruleEmergencyMoveAway: StateRule = ({nearCatch}) =>
    (nearCatch ? "MoveAway" : null);

export const ruleBuildGapIfOpposite: StateRule = ({opposite}) =>
    (opposite ? "BuildGap" : null);

export const ruleLostOppositeBackToCurl: StateRule = ({current, opposite}) =>
    (current === "BuildGap" && !opposite ? "Curl" : null);

export const rulePreferCurlFallback: StateRule = ({current}) =>
    (current === "Curl" ? null : "Curl");

export const ruleCannotMatchOmegaToCurl: StateRule =
    ({ current, cannotMatchOmega }) =>
        (current === "BuildGap" && cannotMatchOmega ? "Curl" : null);

export const defaultRules: StateRule[] = [
    ruleDashIfOppositeAndReady,
    ruleEmergencyMoveAway,
    ruleCannotMatchOmegaToCurl,
    ruleBuildGapIfOpposite,
    ruleLostOppositeBackToCurl,
    rulePreferCurlFallback,
];