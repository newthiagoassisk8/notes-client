#!/usr/bin/env tsx
import { loadEnv } from './helpers/envloader';

const env = loadEnv();
const API_URL = env.API_URL;

function parseArgs(argv = process.argv.slice(2)) {
    const [command = 'list', ...rest] = argv;

    const flags = {};
    for (let i = 0; i < rest.length; i++) {
        let token = rest[i];
        if (token.startsWith('--')) {
            token = token.slice(2);

            if (token.includes('=')) {
                const [k, ...vs] = token.split('=');
                flags[k] = vs.join('=');
            } else {
                const next = rest[i + 1];
                if (!next || next.startsWith('--')) {
                    flags[token] = true;
                } else {
                    flags[token] = next;
                    i++;
                }
            }
        }
    }
    return { command, flags };
}

async function addNote(title, content, tags) {
    if (!title || !content) {
        console.error('Uso: notes add --title "..." --content "..." [--tags tag1,tag2]');
        process.exit(2);
    }

    const res = await fetch(`${API_URL}/notes/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: title,
            content: content,
            tags: tags,
        }),
    });
    if (!res.ok) {
        throw new Error('Erro na requisição: ' + response.status);
    }
    console.log(`✅ Nota criada`);
    return;
}

async function getNotes() {
    try {
        const res = await fetch(`${API_URL}/notes`);
        if (!res.ok) {
            throw new Error('Erro na requisição: ' + res.status);
        }
        const data = await res.json();
        return data?.data ?? [];
    } catch (error) {
        console.error('Falha ao buscar notas:', err.message);
        return [];
    }
}

async function deleteNote(noteId) {
    try {
        await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error('Erro na requisição: ');
        }
        return;
    } catch (error) {
        console.error('');
    }
}

(async () => {
    try {
        const { command, flags } = parseArgs();

        switch (command) {
            case 'list':
            case 'ls':
                console.log(await getNotes());
                break;
            case 'add':
                await addNote(flags);
                break;
            case 'delete':
            case 'del':
            case 'rm':
                await deleteNote(flags);
                break;
            case 'help':
            case '-h':
            case '--help':
                printHelp();
                break;
            default:
                console.error(`Comando desconhecido: ${command}\n`);
                printHelp();
                process.exit(2);
        }
    } catch (err) {
        console.error('Erro:', err.message ?? err);
        process.exit(1);
    }
})();

function printHelp() {
    console.log(`
  Usage:
    notes list
    notes add --title "Minha nota" --content "Conteúdo" [--tags tag1,tag2]
    notes delete --id 123

  Flags comuns:
    --title       Título da nota
    --content     Conteúdo da nota
    --tags        Lista separada por vírgula
    --id          Id da nota (para delete)
  `);
}
