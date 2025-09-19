import {Actor} from "@/app/swim/Pool/Actor";
import {ANG_EPS, CATCH_EPS, CAUGHT, Delta, FLED, OK, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

export class Swimmer extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private vt: number = 0;
    private lastTangSign: -1 | 1 = 1;

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
        const distanceToRim: number = this.poolRadius - centerToSwimmer.len;
        if (distanceToRim < CATCH_EPS) {
            return FLED;
        }

        // time for swimmer to get to the rim
        const tSwimmer: number = distanceToRim / this.speed;

        if (centerToSwimmer.len < CATCH_EPS) {
            // TODO: 0 division
        }
        // closest point on the rim
        const cpr: Point = {
            x: this.poolCenter.x + centerToSwimmer.dx * this.poolRadius / Math.abs(centerToSwimmer.len),
            y: this.poolCenter.y + centerToSwimmer.dy * this.poolRadius / Math.abs(centerToSwimmer.len),
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
        const omegaCoach: number = this.speedOf(opponent) / this.poolRadius;

        // TODO: calculated Swimmer angular speed in this point based on position and linear speed

        // time for coach to get to the swimmer's closest point on the rim. rad/s
        const tCoach = omegaCoach <= ANG_EPS ? Number.POSITIVE_INFINITY : dPhi / omegaCoach;

        // ---- DASH mode
        if (tSwimmer < tCoach) {
            // find the target point using Chord coach-swimmer-rim
            const targetPoint =
            const step = this.speed * dt;
            if (step >= distanceToRim) {
                this.pos = {
                    x: cpr.x,
                    y: cpr.y,
                };
                return FLED;
            }

            // TODO: will swimmer stand still in the center?
            const invr = centerToSwimmer.len === 0 ? 0 : 1 / centerToSwimmer.len;
            this.pos = {
                x: this.pos.x + centerToSwimmer.dx * invr * step,
                y: this.pos.y + centerToSwimmer.dy * invr * step,
            };
            return OK;
        }

        // calculate swimmer angular speed at present location and constant radius
        const swimmerRadius = Math.abs(
            Math.hypot(
                this.pos.x - this.poolCenter.x,
                this.pos.y - this.poolCenter.y,
            ));
        const omegaSwimmer: number = this.speed / swimmerRadius;

        console.log(omegaSwimmer, "    ", omegaCoach, "    ", centerToSwimmer.len);
        console.log(this.position);
        console.log(opponent.position);

        // candidate next position
        const nx = this.pos.x + dir.uVector.ux * this.speed * dt;
        const ny = this.pos.y + dir.uVector.uy * this.speed * dt;

        if (centerToSwimmer.len < this.speed / omegaCoach) {

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
            this.pos = {x: nx, y: ny};
            return OK;
        }


        // move by circle, do not increase radius, to get more far from the coach
        // preserve the direction

        // current radial (center -> swimmer)
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;

        // angles of swimmer and coach
        const thetaS2 = Math.atan2(ry, rx);
        const thetaC2 = Math.atan2(
            opponent.position.y - this.poolCenter.y,
            opponent.position.x - this.poolCenter.x
        );

        // shortest signed angle coach - swimmer in (-π, π]
        let d = (thetaC2 - thetaS2) % (2 * Math.PI);
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;

        // choose direction to INCREASE separation (push |d| toward π):
        // if coach is "ahead CCW" (d>0), rotate CW (sign = -1);
        // if "ahead CW" (d<0), rotate CCW (sign = +1)
        const sign: -1 | 0 | 1 = d > 0 ? -1 : d < 0 ? 1 : 0;
        if (sign !== 0) {
            const dphi = sign * omegaSwimmer * dt; // angular step for the swimmer
            const c = Math.cos(dphi), s = Math.sin(dphi);

            // rotate, the SAME radius
            const nrx = rx * c - ry * s;
            const nry = rx * s + ry * c;

            this.pos = {
                x: this.poolCenter.x + nrx,
                y: this.poolCenter.y + nry,
            };

            return OK;
        }


    }

    /**
     * Intersection of the line through (Swimmer, Coach) with the rim (circle),
     * Returns exit point, unit direction, and distance along this chord.
     */
    private computeChordExitAwayFromCoach(coachPos: Point): { exit: Point; dir: UnitVector; dist: number } {
        // unit direction û: from coach to swimmer
        const unitChord = this.directionFrom(coachPos);
        if (!unitChord) {
            throw new Error("Get caught!");
        }

        // 2) p = S - O
        const px = this.pos.x - this.poolCenter.x;
        const py = this.pos.y - this.poolCenter.y;

        // a = p·û
        const a  = px * unitChord.uVector.ux + py * unitChord.uVector.uy;

        // ||p||^2
        const p2 = px * px + py * py;
        const R2 = this.poolRadius * this.poolRadius;

        // ||w||^2 = ||p||^2 - a^2  (component ⟂ û)
        const w2 = Math.max(0, p2 - a * a);


        return {
            exit: { x: exitX, y: exitY },
            dir: { ux, uy },
            dist: lam, // distance along the chord
        };
    }
}