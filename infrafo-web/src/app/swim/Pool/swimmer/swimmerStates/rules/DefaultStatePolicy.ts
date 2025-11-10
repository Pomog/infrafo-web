import {StatePolicy} from "@/app/swim/Pool/swimmer/swimmerStates/rules/StatePolicy";
import {CATCH_EPS, SwimmerStateName} from "@/app/swim/Pool/Types";
import {SwimmerV4} from "@/app/swim/Pool/swimmer/SwimmerV4";
import {Actor} from "@/app/swim/Pool/Actor";
import {RuleContext, StateRule} from "@/app/swim/Pool/swimmer/swimmerStates/rules/policyRules";

type PolicyLogEvent = {
    rule: string;                      // which rule fired
    from: SwimmerStateName;            // current state before decision
    to: SwimmerStateName | null;       // next state (null = stay)
    ctx: Pick<RuleContext, "ratio" | "opposite" | "dist" | "nearCatch" | "cannotMatchOmega">;
};

type Logger = (e: PolicyLogEvent) => void;


export class DefaultStatePolicy implements StatePolicy {

    constructor(private readonly rules: StateRule[]) {
        if (!rules || rules.length === 0) {
            throw new Error("DefaultStatePolicy: provide at least one rule");
        }
    }

    private logger?: Logger;

    /** Enable or disable logging without changing constructor signature. */
    public setLogger(logger?: Logger): this {
        this.logger = logger;
        return this;
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

        for (let i = 0; i < this.rules.length; i++) {
            const ruleFn = this.rules[i];
            const decision = ruleFn(ctx);

            if (!decision || decision === current) continue;

            if (decision) {
                if (this.logger) {
                    const label = ruleFn.name && ruleFn.name !== "anonymous" ? ruleFn.name : `rule#${i + 1}`;
                    this.logger({ // ← callback
                        rule: label,
                        from: current,
                        to: decision,
                        ctx: { ratio, opposite, dist, nearCatch, cannotMatchOmega }
                    });
                }
                return decision;
            }
        }

        return null;

    }
}