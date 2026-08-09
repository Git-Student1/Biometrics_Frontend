import {backendApi} from "./client.ts";

export type PeopleForVerify = {
    people: string[]
}

// ------------------------------------ fetching people  -----------------------------------------------
export async function fetchPeopleQualifyingForVerification() {
    const response = await backendApi.get<PeopleForVerify>(
        "/people/prediction/qualifying"
    );
    return response.data.people
}

export async function fetchAllVerIdentPeople() {
    const response = await backendApi.get<PeopleForVerify>(
        "/people/prediction/all"
    );
    return response.data.people
}

export async function fetchTrainingPeople() {
    const response = await backendApi.get<PeopleForVerify>(
        "/people/training"
    );
    return response.data.people
}

// ------------------------------------ add person  -----------------------------------------------
export async function addVerIdentPerson(person: string) {
    await backendApi.post(
        "/people/addVerIdentPerson",
        {person: person}
    )
}

export async function addTrainingPerson(person: string) {
    await backendApi.post(
        "/people/addTrainingPerson",
        {person: person}
    )
}

// ------------------------------------ number streams -----------------------------------------------
export function getNumberImgVerIdentStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/people/numberPredictionImgs/${encodeURIComponent(person)}`;
}

export function getNumberPosStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/people/numberPositives/${encodeURIComponent(person)}`;
}

export function getNumberAncStreamUrl(person: string): string {
    return `${backendApi.defaults.baseURL}/people/numberAnchors/${encodeURIComponent(person)}`;
}