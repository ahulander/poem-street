
export function parseMessage<TType>(json: string): TType {
    let result = null;
    try {
        result = JSON.parse(json);
    } catch(error) {
        console.error(error);
        result = null;
    }
    return result;
}
