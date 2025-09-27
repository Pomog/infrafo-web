import {Actor} from "@/app/swim/Pool/Actor";
import {Delta, MyVector, OK, Point, Polar, StepResult, UnitVector} from "@/app/swim/Pool/Types";

export class Swimmer3 extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    private polarState(): Polar {
        const deltaCenter: Delta = this.vecFrom(this.poolCenter);

        const theta: number = Math.atan2(deltaCenter.dy, deltaCenter.dx);

        // radial unit vector OS
        const vr: UnitVector = this.normalize(deltaCenter.dx, deltaCenter.dy);

        // tangential unit vector OS, rotate vr
        const vt: UnitVector = {ux: -vr.uy, uy: vr.ux};

        return {r: deltaCenter.len, theta, vr, vt};
    }

    private angleOf(p: Point): number {
        const dx = p.x - this.poolCenter.x;
        const dy = p.y - this.poolCenter.y;
        return Math.atan2(dy, dx);
    }

    private angDiff(a: number, b: number): number {
        let d = a - b;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        return d;
    }

    private getDistanceToRim(): number {
        const dx = this.position.x - this.poolCenter.x;
        const dy = this.position.y - this.poolCenter.y;
        return this.poolRadius - Math.hypot(dx, dy);
    }

    private getEscapePoint(): Point {
        const radialUnitVector = this.polarState().vr;
        return {
            x: radialUnitVector.ux * this.poolRadius,
            y: radialUnitVector.uy * this.poolRadius,
        }
    };

    private getTimeToEscapePoint(): number {
        return this.getDistanceToRim() / this.speed;
    }

    private getCoachTimeToEscapePoint(coach: Actor): number {
        return this.getCoachDistanceToEscapePoint(coach) / this.speedOf(coach);
    }

    private getCoachDistanceToEscapePoint(coach: Actor): number {
        const swimmerVector: MyVector = {
            vx: this.position.x - this.poolCenter.x,
            vy: this.position.y - this.poolCenter.y,
        };
        const sLen = Math.hypot(swimmerVector.vx, swimmerVector.vy);

        const coachVector: MyVector = {
            vx: coach.position.x - this.poolCenter.x,
            vy: coach.position.y - this.poolCenter.y,
        };

        const dotProduct: number = (
            (swimmerVector.vx * coachVector.vx) +
            (swimmerVector.vy * coachVector.vy)
        );

        const crossProduct = (
            coachVector.vx * swimmerVector.vy -
            coachVector.vy * swimmerVector.vx
        );

        const angleSigned = Math.atan2(crossProduct, dotProduct);
        const angleCCW = ((angleSigned % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI);

        // L = R * α
        const arcCCW = this.poolRadius * angleCCW;
        const arcCW  = this.poolRadius * ((2*Math.PI - angleCCW));

        return Math.min(arcCCW, arcCW);
    }

    update(dt: number, opponent: Actor): StepResult {
        return OK;
    }

}