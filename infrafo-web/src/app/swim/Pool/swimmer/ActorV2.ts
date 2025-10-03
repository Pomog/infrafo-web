import {Point} from "@/app/swim/Pool/Types";

export abstract class ActorV2 {
    protected pos: Point;
    protected opponent: ActorV2 | null;
    protected constructor(
        protected readonly speed: number,
        protected readonly poolRadius: number,
        protected readonly poolCenter: Point,
        position: Point,
    ) {
        this.pos = {...position};
        this.poolCenter = { ...this.poolCenter }
    }

    setOpponent(op: ActorV2) {
        this.opponent = op;
    }

    get position(): Point {
        return { ...this.pos };
    }
}
