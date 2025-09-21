import {Actor} from "@/app/swim/Pool/Actor";
import {
    ANG_EPS,
    CATCH_EPS,
    CAUGHT,
    Delta,
    FLED,
    MyVector,
    OK,
    Point,
    StepResult,
    UnitVector
} from "@/app/swim/Pool/Types";

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

        const chord = this.computeChordExitAwayFromCoach(opponent.position);

        // time for swimmer to get to the rim
        const tSwimmer: number = chord.dist / this.speed;

        if (centerToSwimmer.len < CATCH_EPS) {
            // TODO: 0 division
        }

        const thetaE = Math.atan2(chord.exit.y - this.poolCenter.y, chord.exit.x - this.poolCenter.x);
        const thetaC = Math.atan2(opponent.position.y - this.poolCenter.y, opponent.position.x - this.poolCenter.x);

        // min angle for the coach to reach the swimmer's closest point on the rim
        let dPhi = ((thetaE - thetaC) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        if (dPhi > Math.PI) dPhi = 2 * Math.PI - dPhi;

        // coach angular speed
        const omegaCoach: number = this.speedOf(opponent) / this.poolRadius;

        // time for coach to get to the swimmer's closest point on the rim. rad/s
        const tCoach = omegaCoach <= ANG_EPS ? Number.POSITIVE_INFINITY : dPhi / omegaCoach;

        console.log("tCoach: ", tCoach);
        console.log("omegaCoach: ", omegaCoach);
        console.log("tSwimmer: ", tSwimmer);
        console.log("exitDist: ", chord.dist);

        // ---- DASH mode
        if (tSwimmer < tCoach) {
            // find the target point using Chord coach-swimmer-rim
            const exit = this.computeChordExitAwayFromCoach(opponent.position);
            const step = this.speed * dt;
            if (step >= exit.dist) {
                this.pos = {
                    x: exit.exit.x,
                    y: exit.exit.y,
                };
                return FLED;
            }

            this.pos = {
                x: this.pos.x + exit.dir.ux * step,
                y: this.pos.y + exit.dir.uy * step,
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

        console.log("centerToSwimmer.len", centerToSwimmer.len);
        console.log(this.position);
        console.log(opponent.position);

        console.log("E:", chord.exit, " dist:", chord.dist);
        console.log("tSwimmer:", tSwimmer, " tCoach:", tCoach, " |Δφ|:", Math.abs(dPhi), " ωc:", omegaCoach);

        // candidate next position
        const nx = this.pos.x + dir.uVector.ux * this.speed * dt;
        const ny = this.pos.y + dir.uVector.uy * this.speed * dt;



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

        const r = Math.hypot(rx, ry) || 1;
        const tx = -ry / r, ty = rx / r;
        const tiny = this.speed * dt * 1e-3;
        this.pos = { x: this.pos.x + tx * tiny, y: this.pos.y + ty * tiny };
        return OK;


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

        // vector SO = S - O
        const SO: MyVector = {
            vx: this.pos.x - this.poolCenter.x,
            vy: this.pos.y - this.poolCenter.y,
        };

        // Projection SO to unitChord. SO longitudinal component
        const a: number  = SO.vx * unitChord.uVector.ux + SO.vy * unitChord.uVector.uy;

        // Projection SO to the ⊥ unitChord. SO transverse component
        const cross: number = SO.vx * unitChord.uVector.uy - SO.vy * unitChord.uVector.ux;
        const w2 = cross*cross;

        const R2: number = this.poolRadius * this.poolRadius;
        const disc: number = Math.max(0, R2 - w2);

        let lam: number = -a + Math.sqrt(disc);
        if (lam < 0 && lam > -1e-12) lam = 0;

        const exit: Point = {
            x: this.pos.x + unitChord.uVector.ux * lam,
            y: this.pos.y + unitChord.uVector.uy * lam,
        };

        return {
            exit,
            dir: { ux: unitChord.uVector.ux, uy: unitChord.uVector.uy },
            dist: lam,
        };
    }
}