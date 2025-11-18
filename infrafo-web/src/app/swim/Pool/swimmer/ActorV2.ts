import {ANG_DEAD, CATCH_EPS, Delta, MIN_LEN, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";
import {Actor} from "@/app/swim/Pool/Actor";

export abstract class ActorV2 {
    pos: Point;

    protected constructor(
        readonly speed: number,
        protected readonly poolRadius: number,
        protected readonly poolCenter: Point,
        position: Point,
    ) {
        this.pos = {...position};
        this.poolCenter = {...poolCenter}
    }

    get position(): Readonly<Point> {
        return this.pos;
    }

    set position(p: Readonly<Point>) {
        this.setPosition(p);
    }

    setPosition(p: Readonly<Point>): void {
        this.pos.x = p.x;
        this.pos.y = p.y;
        this.limitByPoolSize();
    }

    nudge(dx: number, dy: number): void {
        this.pos.x += dx;
        this.pos.y += dy;
        this.limitByPoolSize();
    }

    protected normalize(x: number, y: number): UnitVector {
        const L = Math.hypot(x, y);
        return L > 0 ? {ux: x / L, uy: y / L} : {ux: 1, uy: 0};
    }

    protected speedOf(other: Actor): number {
        return other.speed;
    }

    limitByPoolSize() {
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;
        const r = Math.hypot(rx, ry);
        if (r > this.poolRadius) {
            const k = this.poolRadius / r;
            this.pos.x = this.poolCenter.x + rx * k;
            this.pos.y = this.poolCenter.y + ry * k;
        }
    };

    public getPoolCenter(): Readonly<Point> {
        return {x: this.poolCenter.x, y: this.poolCenter.y};
    }

    public getPoolRadius(): number {
        return this.poolRadius;
    }

    moveAlong(u: UnitVector, dt: number): void {
        this.nudge(u.ux * this.speed * dt, u.uy * this.speed * dt);
    }

    abstract update(opponent: Actor, dt: number): StepResult;

    vecFrom(p: Point): Delta {
        const dx = this.pos.x - p.x;
        const dy = this.pos.y - p.y;
        const len = Math.hypot(dx, dy);
        return {dx, dy, len};
    }

    protected distanceToActor(other: Actor): number {
        return this.vecFrom(other.position).len;
    }

    protected isCaught(other: Actor, eps: number = CATCH_EPS): boolean {
        return this.distanceToActor(other) <= eps;
    }

    protected isFled() {
        // eps protects is the radius is large
        const eps = Math.max(MIN_LEN, MIN_LEN * this.poolRadius);
        return (this.poolRadius - this.distanceFromCenter()) <= eps;
    }

    getUnitVectorFrom = (position: Readonly<Point>): UnitVector => {
        const delta = this.vecFrom(position);

        if (!Number.isFinite(delta.len) || delta.len < MIN_LEN) {
            throw new Error("getUnitVectorFrom: coincident points (cannot define direction)");
        }

        return {ux: delta.dx / delta.len, uy: delta.dy / delta.len};
    };

    public normalizedDistanceFromCenter(): number {
        return this.distanceFromCenter() / this.poolRadius;
    }

    public distanceFromCenter(): number {
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;
        return Math.hypot(rx, ry);
    }

    public radialUnitFromCenter(): UnitVector {
        const rx = this.pos.x - this.poolCenter.x;
        const ry = this.pos.y - this.poolCenter.y;
        const r = Math.hypot(rx, ry);
        const EPS = MIN_LEN;

        if (!Number.isFinite(r) || r <= EPS) {
            throw new Error("radialUnitFromCenter: actor at/near center; direction undefined");
        }

        return {ux: rx / r, uy: ry / r};
    }

    private angDiffRad(a: number, b: number): number {
        let d = a - b;
        while (d > Math.PI) d -= 2 * Math.PI;
        while (d < -Math.PI) d += 2 * Math.PI;
        return d;
    }

    /**
     * Returns true if `this` and `other` lie on the same line through the pool center
     * but on OPPOSITE sides (i.e., angle between their radial unit vectors is ~ π).
     *
     * @param other   The opponent actor to compare against.
     * @param angDead Angular tolerance in radians (defaults to ANG_DEAD).
     */
    public isOppositeThroughCenter(other: Actor, angDead: number = ANG_DEAD): boolean {
        // Vector center -> this
        const csx = this.pos.x - this.poolCenter.x;
        const csy = this.pos.y - this.poolCenter.y;
        const csLen = Math.hypot(csx, csy);

        // Vector center -> other
        const ckx = other.position.x - this.poolCenter.x;
        const cky = other.position.y - this.poolCenter.y;
        const ckLen = Math.hypot(ckx, cky);

        // Both radii must be well-defined
        if (!(csLen > MIN_LEN && ckLen > MIN_LEN)) return false;

        // Normalize to radial unit vectors
        const csux = csx / csLen, csuy = csy / csLen; // unit(center->this)
        const ckux = ckx / ckLen, ckuy = cky / ckLen; // unit(center->other)

        // For unit vectors: dot = cos(Δθ), cross(z) = sin(Δθ)
        const dot = csux * ckux + csuy * ckuy;        // cos(Δθ)
        const cross = csux * ckuy - csuy * ckux;        // sin(Δθ)

        // Opposite sides ≈ angle = π: |sin| small and cos -1
        return Math.abs(cross) <= Math.sin(ANG_DEAD) && dot <= -Math.cos(ANG_DEAD);
    }


}
