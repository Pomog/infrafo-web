import {Actor} from "@/app/swim/Pool/Actor";
import {Delta, Point, Polar, UnitVector} from "@/app/swim/Pool/Types";

export class Swimmer3 extends Actor {

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

}