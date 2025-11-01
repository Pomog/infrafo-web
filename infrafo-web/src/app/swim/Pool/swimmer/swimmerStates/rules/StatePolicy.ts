import {SwimmerStateName} from "@/app/swim/Pool/Types";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";

/**
 * Decides which state should be active next.
 * Return `null` to keep the current state.
 */
export interface StatePolicy {
    decide(current: SwimmerStateName, swimmer: SwimmerV4, coach: Actor): SwimmerStateName | null
}

