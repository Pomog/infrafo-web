import {Actor} from "@/app/swim/Pool/Actor";
import {CATCH_EPS, MyVector, OK, Point, StepResult, UnitVector} from "@/app/swim/Pool/Types";

export class Coach extends Actor {
    private readonly poolRadius: number;
    private readonly poolCenter: Point;

    constructor(speed: number, start: Point, poolRadius: number, poolCenter: Point) {
        super(speed, start);
        this.poolRadius = poolRadius;
        this.poolCenter = poolCenter;
    }

    update(dt: number, opponent: Actor): StepResult {
        return OK;
    }

    private chooseDirCCW(opponentPos: Point): -1 | 0 | 1 {
        const radialVector: UnitVector = {
            ux: this.pos.x - this.poolCenter.x,
            uy: this.pos.y - this.poolCenter.y,
        };

        const rl = Math.hypot(radialVector.ux, radialVector.uy);
        if (rl === 0) return 0;

        const radialUnitVector: UnitVector = {
            ux: radialVector.ux / rl,
            uy: radialVector.uy / rl,
        };

        const ccwVector: MyVector = {
            vx: -radialUnitVector.uy,
            vy: radialUnitVector.ux
        }

        const vectorToOpponent: MyVector = {
            vx: this.pos.x - opponentPos.x,
            vy: this.pos.y - opponentPos.y,
        }

        const dotProduct: number = (ccwVector.vx*vectorToOpponent.vx) + (ccwVector.vy*vectorToOpponent.vy);

        if (Math.abs(dotProduct) > CATCH_EPS) return dotProduct < 0 ? 1 : -1;




    }

}