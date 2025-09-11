export type Point = { x: number; y: number };

abstract class Actor {
    protected pos: Point;

    protected constructor(
        protected readonly speed: number,
        startPoint: Point
    ) {
        this.pos = {...startPoint};
    }

    protected getDistance(opponent: Actor) {
        const dx = this.pos.x - opponent.position.x;
        const dy: number = this.pos.y - opponent.position.y;
        return Math.hypot(dx, dy);
    }

    abstract update(dt: number, opponent: Actor): void;

    public get position(): Point {
        return this.pos;
    }
}