import {StatePolicy} from "@/app/swim/Pool/swimmer/swimmerStates/rules/StatePolicy";
import {CATCH_EPS, SwimmerStateName} from "@/app/swim/Pool/Types";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";
import {RuleContext, StateRule} from "@/app/swim/Pool/swimmer/swimmerStates/rules/policyRules";

export class DefaultStatePolicy implements StatePolicy {

    constructor(private readonly rules: StateRule[]) {
        if (!rules || rules.length === 0) {
            throw new Error("DefaultStatePolicy: provide at least one rule");
        }
    }

    decide(current: SwimmerStateName, swimmer: SwimmerV4, coach: Actor): SwimmerStateName | null {
        const ratio    = swimmer.normalizedDistanceFromCenter();
        const opposite = swimmer.isOppositeThroughCenter(coach);
        const dist     = swimmer.vecFrom(coach.position).len;
        const nearCatch = Number.isFinite(dist) && dist <= 2 * CATCH_EPS;

        const { r }     = swimmer.polarState();
        const omega     = swimmer.getCoachAngularVelocity(coach);
        const vtMatch   = Math.abs(omega) * r;
        const cannotMatchOmega = !(Number.isFinite(vtMatch)) || vtMatch >= swimmer.speed;

        const ctx: RuleContext = { current, swimmer, coach, ratio, opposite, dist, nearCatch, cannotMatchOmega  };

        for (const rule of this.rules) {
            const decision = rule(ctx);
            if (decision) return decision;
        }

        return null;
    }
}