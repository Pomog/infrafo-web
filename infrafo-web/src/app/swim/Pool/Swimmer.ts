import { Actor } from "@/app/swim/Pool/Actor";
import {ANG_EPS, CATCH_EPS, CAUGHT, Delta, FLED, OK, Point, StepResult} from "@/app/swim/Pool/Types";

export class Swimmer extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;

    // we need pool radius/center to detect "fled to the rim"
    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    update(dt: number, opponent: Actor): StepResult {
        // caught?
        if (this.isCaught(opponent)) return CAUGHT;

        // direction away from the coach
        const dir = this.directionFrom(opponent.position);
        if (!dir) return CAUGHT;

        // vector from center O to swimmer and distance
        const centerToSwimmer: Delta = this.vecFrom(this.poolCenter);

        // distance swimmer to the rim
        const distanceToRim : number = this.poolRadius - centerToSwimmer.len;
        if( distanceToRim < CATCH_EPS) {
            return FLED;
        }

        // time for swimmer to get to the rim
        const tSwimmer: number = distanceToRim  / this.speed;


        if (centerToSwimmer.len < CATCH_EPS) {
            // TODO: 0 division
        }
        // closest point on the rim
        const cpr: Point = {
            x: this.poolCenter.x + centerToSwimmer.dx * this.poolRadius/Math.abs(centerToSwimmer.len),
            y: this.poolCenter.y + centerToSwimmer.dy * this.poolRadius/Math.abs(centerToSwimmer.len),
        };

        const thetaS = centerToSwimmer.len === 0 ?
            0 : Math.atan2(centerToSwimmer.dy, centerToSwimmer.dx);
        const thetaC = Math.atan2(
            opponent.position.y - this.poolCenter.y,
            opponent.position.x - this.poolCenter.x
        );

        // min angle for the coach to reach the swimmer's closest point on the rim
        let dPhi = ((thetaS - thetaC) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        if (dPhi > Math.PI) dPhi = 2 * Math.PI - dPhi;

        // coach angular speed
        const omega = this.speedOf(opponent) / this.poolRadius;

        // TODO: calculated Swimmer angular speed in this point based on position and linear speed

        // time for coach to get to the swimmer's closest point on the rim. rad/s
        const tCoach = omega <= ANG_EPS ? Number.POSITIVE_INFINITY : dPhi / omega;

        if (tSwimmer < tCoach) {
            // ---- DASH
            const step = this.speed * dt;
            if (step >= distanceToRim) {
                  this.pos = {
                    x: cpr.x,
                    y: cpr.y,
                };
                return FLED;
            }

            const invr = centerToSwimmer.len === 0 ? 0 : 1 / centerToSwimmer.len;
            this.pos = {
                x: this.pos.x + centerToSwimmer.dx * invr * step,
                y: this.pos.y + centerToSwimmer.dy * invr * step,
            };
            return OK;
        }

        // candidate next position
        const nx = this.pos.x + dir.uVector.ux * this.speed * dt;
        const ny = this.pos.y + dir.uVector.uy * this.speed * dt;

        // check rim crossing
        const cx = nx - this.poolCenter.x;
        const cy = ny - this.poolCenter.y;
        const rNext = Math.hypot(cx, cy);

        if (rNext >= this.poolRadius) {
            // snap to the rim and report FLED
            const inv = rNext === 0 ? 0 : this.poolRadius / rNext;
            this.pos = {
                x: this.poolCenter.x + cx * inv,
                y: this.poolCenter.y + cy * inv,
            };
            return FLED;
        }

        // normal move
        this.pos = { x: nx, y: ny };
        return OK;
    }
}