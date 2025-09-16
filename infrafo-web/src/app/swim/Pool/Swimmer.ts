import { Actor } from "@/app/swim/Pool/Actor";
import {CATCH_EPS, CAUGHT, Delta, FLED, MyVector, OK, Point, StepResult} from "@/app/swim/Pool/Types";

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

        // TODO: check dash mode if it is possible large curvature - flawed strategy

        // vector from center O to swimmer and distance
        const centerToSwimmer: Delta = this.vecFrom(this.poolCenter);

        // distance swimmer to the rim
        const distanceToRim : number = this.poolRadius - centerToSwimmer.len;

        // time for swimmer to get to the rim
        const tSwimmer: number = distanceToRim  / this.speed;

        // closest point on the rim
        const cpr: Point = {
            x: this.poolCenter.x + centerToSwimmer.dx * this.poolRadius/Math.abs(centerToSwimmer.len),
            y: this.poolCenter.y + centerToSwimmer.dy * this.poolRadius/Math.abs(centerToSwimmer.len),
        };

        // time for coach to get to the swimmer's closest point on the rim. rad/s
        const omega = this.speedOf(opponent) / this.poolRadius;

        const thetaS = centerToSwimmer.len === 0 ?
            0 : Math.atan2(centerToSwimmer.dy, centerToSwimmer.dx);
        const thetaC = Math.atan2(
            opponent.position.y - this.poolCenter.y,
            opponent.position.x - this.poolCenter.x
        );

        // min angle for the coach to get to the swimmer's closest point on the rim
        let dPhi = ((thetaS - thetaC) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        if (dPhi > Math.PI) dPhi = 2 * Math.PI - dPhi;

        // time for coach to get to the rim
        const tCoach = omega <= CATCH_EPS ? Number.POSITIVE_INFINITY : dPhi / omega;

        if (tSwimmer < tCoach) {
            const nx = this.pos.x +
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