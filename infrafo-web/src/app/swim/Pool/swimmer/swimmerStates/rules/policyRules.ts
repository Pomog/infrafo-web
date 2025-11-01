import {RuleContext} from "@/app/swim/Pool/swimmer/swimmerStates/rules/StatePolicy";
import {DASH_LIMIT, SwimmerStateName} from "@/app/swim/Pool/Types";

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

export const defaultRules: StateRule[] = [
    ruleDashIfOppositeAndReady,
    ruleEmergencyMoveAway,
    ruleBuildGapIfOpposite,
    ruleLostOppositeBackToCurl,
    rulePreferCurlFallback,
];