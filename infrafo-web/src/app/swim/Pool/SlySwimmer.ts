import {Actor} from "@/app/swim/Pool/Actor";
import {
    ANG_DEAD,
    CAUGHT,
    Delta,
    MARGIN,
    MAX_RATIO_VT_VR,
    MIN_LEN,
    OK,
    Point,
    Polar,
    StepResult,
    UnitVector
} from "@/app/swim/Pool/Types";


export class SlySwimmer extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;
    private vt: number = 0;
    private lastTangSign: -1 | 1 = 1;
    private tangentialVelocity: number = 0;
    private radialVelocity: number = 0;

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    private polarState(): Polar {
        const vectorFromCenter: Delta = this.vecFrom(this.poolCenter);

        const theta: number = Math.atan2(vectorFromCenter.dy, vectorFromCenter.dx);

        // radial unit vector OS
        const vr: UnitVector = this.normalize(vectorFromCenter.dx, vectorFromCenter.dy);

        // tangential unit vector OS, rotate vr
        const vt: UnitVector = {ux: -vr.uy, uy: vr.ux};

        return {r: vectorFromCenter.len, theta, vr, vt};
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

    private normalize(x: number, y: number): UnitVector {
        const L = Math.hypot(x, y);
        return L > 0 ? {ux: x / L, uy: y / L} : {ux: 1, uy: 0};
    }

    update(dt: number, opponent: Actor): StepResult {
        // caught?
        if (this.isCaught(opponent)) return CAUGHT;

        // swimmer polar state
        const sps: Polar = this.polarState();

        // coach angle and angle diff swimmer - coach ([-π, π])
        const thetaCoach = this.angleOf(opponent.position);
        const dTheta = this.angDiff(sps.theta, thetaCoach);

        // direction of tangent
        let tangSign: -1 | 1;

        if (Math.abs(dTheta) < ANG_DEAD) {
            tangSign = this.lastTangSign;
        } else {
            tangSign = dTheta >= 0 ? 1 : -1;
            this.lastTangSign = tangSign;
        }

        // coach tangential speed
        const vCoach = this.speedOf(opponent);
        const omegaCoach = vCoach / this.poolRadius // 1/sec

        // minimum required tangential component for overtaking
        const r = Math.max(sps.r, MIN_LEN);
        const vTotal = this.speed;
        const vt_need = (omegaCoach + MARGIN) * r; // m/sec

        // tan for speed component vectors ≤ K
        const K = MAX_RATIO_VT_VR;

        // the spiral shape limit
        const vt_cap_by_ratio = (K / Math.sqrt(1 + K * K)) * vTotal;

        // choose tangential speed component
        const vt = Math.min(Math.max(vt_need, 0), vt_cap_by_ratio);

        // add sign to the tangential speed component
        const vtSigned = tangSign * vt;

        // choose radial speed component
        const vr = Math.sqrt(Math.max(vTotal * vTotal - vt * vt, 0));

        // save both speed component to the object properties
        this.tangentialVelocity = vtSigned;
        this.radialVelocity = vr;

        console.log("tangentialVelocity: ", this.tangentialVelocity);
        console.log("radialVelocity: ", this.radialVelocity);
        console.log("vt_cap_by_ratio: ", vt_cap_by_ratio);
        console.log("vTotal: ", vTotal);
        console.log("opponent: ", this.speedOf(opponent));
        console.log("omegaCoach: ", omegaCoach);
        console.log("omegaSwimmer: ", vtSigned/sps.r);
        console.log("vt_need: ", vt_need);

        console.log({
            r,
            vt_need,
            vt_cap_by_ratio,
            vtSigned,
            vr,
            omegaCoach,
            omegaSwim: Math.abs(vtSigned) / r,
            overtaking: (Math.abs(vtSigned) / r) > omegaCoach
        });

        // combine total speed vector. (Vx, Vy) = vTotal
        const Vx = (vr * sps.vr.ux) + (vtSigned * sps.vt.ux);
        const Vy = (vr * sps.vr.uy) + (vtSigned * sps.vt.uy);
        const V_len = Math.hypot(Vx, Vy);
        const EPS = 1e-12;
        let ux = 1, uy = 0;
        if (V_len > EPS) {
            ux = Vx / V_len;
            uy = Vy / V_len;
        } else {
            // go radial if total speed vector = 0
            ux = sps.vr.ux;
            uy = sps.vr.uy;
        }

        this.moveAlong({ux, uy}, dt);

        const after = this.vecFrom(this.poolCenter);
        if (after.len > this.poolRadius) {
            const k = this.poolRadius / after.len;
            this.pos = {
                x: this.poolCenter.x + after.dx * k,
                y: this.poolCenter.y + after.dy * k
            };
        }
        if (this.isCaught(opponent)) return CAUGHT;

        return OK;
    }
}