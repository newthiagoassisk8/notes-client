#!/usr/bin/env tsx
import { loadEnv } from "./helpers/envloader";

const env = loadEnv();
const API_URL = env.API_URL;

async function addNote(title, content, tags) {
    const res = await fetch(`${API_URL}/notes/new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
            tags: tags,
        }),
    });
    if (!res.ok) {
        throw new Error("Erro na requisição: " + response.status);
    }
    return;
}

async function getNotes() {
    try {
        const res = await fetch(`${API_URL}/notes`);
        if (!res.ok) {
            throw new Error("Erro na requisição: " + res.status);
        }
        const data = await res.json();
        return data?.data ?? [];
    } catch (error) {
        console.error("Falha ao buscar notas:", err.message);
        return [];
    }
}

async function deleteNote(noteId) {
    try {
        await fetch(`${API_URL}/notes/${noteId}`, { method: "DELETE" });
        if (!res.ok) {
            throw new Error("Erro na requisição: ");
        }
        return;
    } catch (error) {
        console.error("");
    }
}

(async () => {
    await getNotes();
})();
