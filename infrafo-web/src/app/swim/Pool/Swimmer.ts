import { Actor } from "@/app/swim/Pool/Actor";
import { CAUGHT, FLED, OK, Point, StepResult } from "@/app/swim/Pool/Types";

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