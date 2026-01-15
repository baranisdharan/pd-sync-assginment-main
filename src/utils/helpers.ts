// helper to get nested values like "phoneNumber.home"
export function getValue(obj: any, path: string): any {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// build payload from mappings
export function buildPayload(data: any, maps: any[]): any {
    const result: any = {};

    for (const m of maps) {
        const val = getValue(data, m.inputKey);
        if (!val) continue;

        // email and phone need special format for pipedrive
        if (m.pipedriveKey === "email") {
            result.email = [{ value: val, primary: true, label: "work" }];
        } else if (m.pipedriveKey === "phone") {
            result.phone = [{ value: val, primary: true, label: "work" }];
        } else {
            result[m.pipedriveKey] = val;
        }
    }
    return result;
}
