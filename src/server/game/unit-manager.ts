import { UnitData, UnitType } from "../../common/entities/unit";

export class UnitManager {

    private readonly allUnits: UnitData[] = [];
    
    private readonly unitByIds: {[id: number]: UnitData} = {};
    private nextUnitId = 0;
    

    findById(unitId: number) {
        return this.unitByIds[unitId];
    }

    createUnit(userId: number, unitType: UnitType, x: number, y: number) {
        const unit: UnitData = {
            id: this.nextUnitId++,
            userId: userId,
            type: unitType,
            position: {
                x: x,
                y: y
            },
            moving: false,
            target: null
        };
        this.allUnits.push(unit);
        this.updateUnitCache(unit);
        return unit;
    }

    /**
     * Important! This will actually modify the underlying unit storage.
     * Don't call this while iterating over all units
     * @param unitId Id the of the unit you're looking for
     */
    destroyUnit(unitId: number) {
        const unit = this.findById(unitId);

        if (!unit) {
            return;
        }

        this.deleteFromUnitCache(unit);
        const index = this.allUnits.findIndex(u => u.id === unit.id);
        this.allUnits.splice(index, 1);
    }

    foreach(callback: (unit: UnitData) => void) {
        const length = this.allUnits.length;
        for (let i = 0; i < length; ++i) {
            callback(this.allUnits[i]);
        }
    }

    private updateUnitCache(unit: UnitData) {
        this.unitByIds[unit.id] = unit;
    }

    private deleteFromUnitCache(unit: UnitData) {
        delete this.unitByIds[unit.id];
    }
}
