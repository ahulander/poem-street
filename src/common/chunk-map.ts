import { AxisAlignedBoundingBox } from "./math/axis-aligned-bounding-box";

export interface ChunkMapInfo {
    readonly chunkCountX: number;
    readonly chunkCountY: number;
    readonly chunkWidth: number;
    readonly chunkHeight: number;
}

export interface ChunkMap<TData> {
    readonly info: ChunkMapInfo;
    readonly chunks: { [id: number]: TData };
}

export namespace ChunkMap {

    enum ChunkMapError {
        OK,
        ERROR_NULL,
        ERROR_BAD_VALUE
    }

    function validateInfo(info: ChunkMapInfo) {
        if (!info) {
            return ChunkMapError.ERROR_NULL;
        }
        else if (!info.chunkCountX || !info.chunkCountY || !info.chunkWidth || !info.chunkHeight) {
            return ChunkMapError.ERROR_NULL;
        }
        else if (info.chunkCountX < 0 || info.chunkCountY < 0 || info.chunkWidth < 0 || info.chunkHeight < 0) {
            return ChunkMapError.ERROR_BAD_VALUE;
        }

        return ChunkMapError.OK;
    }

    function errorToString(error: ChunkMapError, info: ChunkMapInfo) {
        switch (error) {
            case ChunkMapError.ERROR_BAD_VALUE:
                return `Values can't be zero or negative. ${info}`;
            case ChunkMapError.ERROR_NULL:
                return `Values can't be null`;

            case ChunkMapError.OK:
                return "Ok";
        }
        return "Unknown error!";
    }

    function calculateIndex(x: number, y: number, chunkCountX: number) {
        return x + y * chunkCountX;
    }

    export function create<TData>(info: ChunkMapInfo, initChunk: () => TData): ChunkMap<TData> {

        const error = validateInfo(info);
        if (error != ChunkMapError.OK) {
            console.error(`Unable to create Chunk Map! ${errorToString(error, info)}`);
            return null;
        }

        const result: ChunkMap<any> = {
            info: info,
            chunks: {}
        };

        for (let y = 0; y < info.chunkCountY; ++y) {
            for (let x = 0; x < info.chunkCountX; ++x) {
                const i = calculateIndex(x, y, info.chunkCountX);
                result.chunks[i] = initChunk();
            }
        }

        return result;
    }

    export function getChunkFromPoint<TData>(chunkMap: ChunkMap<TData>, worldX: number, worldY: number) {
        const x = Math.floor(worldX / chunkMap.info.chunkWidth);
        const y = Math.floor(worldY / chunkMap.info.chunkHeight);
        const i = calculateIndex(x, y, chunkMap.info.chunkCountX);

        if (chunkMap.chunks[i]) {
            return chunkMap.chunks[i];
        }

        return null;
    }

    export function getChunksFromRect<TData>(chunkMap: ChunkMap<TData>, rect: AxisAlignedBoundingBox) {
        const left = rect.centerX - rect.halfWidth;
        const right = rect.centerX + rect.halfWidth;
        const top = rect.centerY + rect.halfHeight;
        const bottom = rect.centerY - rect.halfHeight;
        const stepX = chunkMap.info.chunkWidth;
        const stepY = chunkMap.info.chunkHeight;

        const result: TData[] = [];

        for (let y = bottom; y <= top; y += stepY) {
            for (let x = left; x < right; x += stepX) {
                const chunk = getChunkFromPoint(chunkMap, x, y);
                if (chunk && !result.find(c => c === chunk)) {
                    result.push(chunk);
                }
            }
        }

        return result;
    }
}

