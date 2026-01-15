import type { PipedrivePerson } from "../types/pipedrive";

// search person by name
export async function searchPerson(name: string): Promise<number | null> {
    const apiKey = process.env.PIPEDRIVE_API_KEY;
    const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

    const url = `https://${companyDomain}.pipedrive.com/api/v1/persons/search?term=${encodeURIComponent(name)}&fields=name&exact_match=true&api_token=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success && data.data?.items?.length > 0) {
        return data.data.items[0].item.id;
    }
    return null;
}

// create new person
export async function createPerson(payload: any): Promise<PipedrivePerson> {
    const apiKey = process.env.PIPEDRIVE_API_KEY;
    const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

    const url = `https://${companyDomain}.pipedrive.com/api/v1/persons?api_token=${apiKey}`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(`Failed to create: ${data.error}`);
    }
    return data.data;
}

// update existing person
export async function updatePerson(id: number, payload: any): Promise<PipedrivePerson> {
    const apiKey = process.env.PIPEDRIVE_API_KEY;
    const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

    const url = `https://${companyDomain}.pipedrive.com/api/v1/persons/${id}?api_token=${apiKey}`;

    const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) {
        throw new Error(`Failed to update: ${data.error}`);
    }
    return data.data;
}
