import {Actor} from "@/app/swim/Pool/Actor";
import {
    CATCH_EPS,
    CAUGHT,
    Delta, FLED,
    MyVector,
    OK,
    Point,
    Polar,
    StateName,
    StepResult,
    UnitVector
} from "@/app/swim/Pool/Types";

export class Swimmer3 extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private state: StateName = 'BuildGap';

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    private getCoachAngularVelocity(coach: Actor): number {
        return this.speedOf(coach)/this.poolRadius;
    };

    private getRequiredSwimmerTangentialSpeed(coach: Actor): number {
        const coachAngularVelocity = this.getCoachAngularVelocity(coach);
        return  Math.abs(coachAngularVelocity * this.polarState().r)*1.1
    };

    private getRadialSpeed(coach: Actor): number {
        const vt = this.getRequiredSwimmerTangentialSpeed(coach);
        if (vt >= this.speed) return 0;
        return Math.sqrt(this.speed*this.speed - vt*vt);
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

    private angDiffRad(a: number, b: number): number {
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

    private getTimeToEscapePoint(): number {
        const dist = Math.max(0, this.getDistanceToRim());
        return dist / this.speed;
    }

    private getCoachTimeToEscapePoint(coach: Actor): number {
        const arcLength = this.getCoachAngleToEscapePoint(coach) * this.poolRadius;
        return arcLength / this.speedOf(coach);
    }

    private getCoachAngleToEscapePoint(coach: Actor): number {
        const swimmerVector: MyVector = {
            vx: this.position.x - this.poolCenter.x,
            vy: this.position.y - this.poolCenter.y,
        };

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

        const angleCW  = ((2*Math.PI - angleCCW));


        return Math.min(angleCW, angleCCW);
    }

    private moveByVelocity(speedVector: MyVector, dt: number) {
        this.pos.x += speedVector.vx * dt;
        this.pos.y += speedVector.vy * dt;
        this.limitByPoolSize();
    };

    private limitByPoolSize() {
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;
        const r = Math.hypot(rx, ry);
        if (r > this.poolRadius) {
            const k = this.poolRadius / r;
            this.pos.x = this.poolCenter.x + rx * k;
            this.pos.y = this.poolCenter.y + ry * k;
        }
    };

    protected moveAlong(uVector: UnitVector, dt: number): void {
        this.pos.x = this.pos.x + uVector.ux * this.speed * dt;
        this.pos.y = this.pos.y + uVector.uy * this.speed * dt;
        this.limitByPoolSize();
    };

    update(dt: number, coach: Actor): StepResult {
        if (this.isCaught(coach)) return CAUGHT;

        const polar: Polar = this.polarState();

        if (this.isFled(this.poolCenter, this.poolRadius)) {
            return FLED;
        }

        const thetaCoach = this.angleOf(coach.position);
        const dThetaSigned = this.angDiffRad(polar.theta, thetaCoach);

        console.log('pos', this.pos);
        console.log(polar);

        console.log("dThetaSigned: ", dThetaSigned);

        const swimmerT = this.getTimeToEscapePoint();
        const coachT = this.getCoachTimeToEscapePoint(coach);
        const shouldDash = swimmerT + CATCH_EPS < coachT;

        console.log("coachT: ", coachT);
        console.log("swimmerT: ", swimmerT);

        console.log(shouldDash);

        if (!shouldDash) {

            const vtMag: number = this.getRequiredSwimmerTangentialSpeed(coach);

            const vrMag = this.getRadialSpeed(coach);

            console.log("vtMag: ", vtMag, " vrMag: ", vrMag);

            // TODO: this is wrong, the swimmer should move away from the coach and not away from the center
            const { vr, vt } = this.polarState();
            const swimmerSpeedVector: MyVector = {
                vx: vt.ux * vtMag + vr.ux * vrMag,
                vy: vt.uy * vtMag + vr.uy * vrMag,
            };

            console.log("swimmerSpeedVector");
            console.log(swimmerSpeedVector);

            this.moveByVelocity(swimmerSpeedVector, dt);


        } else {
            this.moveAlong(polar.vr, dt);
        }





        return OK;
    }

}