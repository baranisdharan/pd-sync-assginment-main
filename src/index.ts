import dotenv from "dotenv";
import type { PipedrivePerson } from "./types/pipedrive";
import { buildPayload } from "./utils/helpers";
import { searchPerson, createPerson, updatePerson } from "./api/pipedrive";
import inputData from "./mappings/inputData.json";
import mappings from "./mappings/mappings.json";

dotenv.config();

const apiKey = process.env.PIPEDRIVE_API_KEY;
const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

const syncPdPerson = async (): Promise<PipedrivePerson> => {
  try {
    // check config
    if (!apiKey || !companyDomain) {
      throw new Error("Missing API key or company domain in .env");
    }

    // build the payload from input data using mappings
    const payload = buildPayload(inputData, mappings);

    if (!payload.name) {
      throw new Error("Name is required");
    }

    console.log("Syncing person:", payload.name);

    // check if person already exists
    const existingId = await searchPerson(payload.name);

    let person: PipedrivePerson;

    if (existingId) {
      console.log("Found existing person, updating...");
      person = await updatePerson(existingId, payload);
    } else {
      console.log("Person not found, creating new...");
      person = await createPerson(payload);
    }

    console.log("Done! Person ID:", person.id);
    return person;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// run it
syncPdPerson()
  .then((p) => console.log("Result:", JSON.stringify(p, null, 2)))
  .catch(() => process.exit(1));
