#!/usr/bin/env tsx
import { loadEnv } from './helpers/envloader';

const env = loadEnv();
const API_URL = env.API_URL;

/*
@id:nhoizey.gremlins @id:fabiospampinato.vscode-highlight @id:vincaslt.highlight-matching-tag @id:ms-vscode.vscode-typescript-next
*/

function parseArgs(argv = null) {
    argv = Array.isArray(argv) ? argv : process.argv.slice(2);
    // argv = [ '--color=true', '--json', '--output=json', '--db-dir=~/.my-notes', '-T', '-q', '-v', './my-dir' ] // REMOVER

    let action = null;
    let defaultAction = 'list';
    let validActions = ['list', 'ls', 'add', 'delete', 'del', 'rm', 'help', '-h', '--help'];

    const parsedArgv = {
        argv,
        parsedFlags: [],
    };

    for (let arg of argv) {
        let isLongFlag = arg.startsWith('--');
        let isShortFlag = !isLongFlag && arg.startsWith('-') && arg.length === 2;
        let isAFlag = isLongFlag || isShortFlag;
        let isABooleanFlag = isAFlag && !arg.includes('=');
        let [argKey, ...argValue] = arg.split('=');
        argValue = isABooleanFlag ? true : (Array.isArray(argValue) ? argValue : []).join('=');
        // let argValue = isABooleanFlag ? true : arg.split('=').slice(1).join('=');

        let argAlterKey = null;

        if (isAFlag) {
            argAlterKey = isLongFlag ? argKey.slice(2) : argKey.slice(1);
        }

        if (!isAFlag) {
            argValue = arg;
        }

        parsedArgv.parsedFlags.push({ arg, isAFlag, isABooleanFlag, argKey, argAlterKey, argValue });
    }

    // action = parsedArgv.parsedFlags.find(i => {
    //     i = i || {};
    //     return i.argAlterKey === 'action'
    // }) || defaultAction;

    if (!action && validActions.includes(argv[0] || defaultAction)) {
        action = argv[0] || defaultAction;
        parsedArgv.parsedFlags.push({
            arg: action,
            isAFlag: false,
            isABooleanFlag: false,
            argKey: null,
            argAlterKey: 'action',
            argValue: action,
        });
    }

    return parsedArgv;

    // const flags = {};
    // for (let i = 0; i < rest.length; i++) {
    //     let token = rest[i];
    //     if (token.startsWith('--')) {
    //         token = token.slice(2);

    //         if (token.includes('=')) {
    //             const [k, ...vs] = token.split('=');
    //             flags[k] = vs.join('=');
    //         } else {
    //             const next = rest[i + 1];
    //             if (!next || next.startsWith('--')) {
    //                 flags[token] = true;
    //             } else {
    //                 flags[token] = next;
    //                 i++;
    //             }
    //         }
    //     }
    // }
    // return { command, flags };
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

async function main() {
    try {
        const { argv, action, parsedFlags } = parseArgs();
        // console.log({ argv, parsedFlags })

        let a_action = parsedFlags.find((i) => {
            i = i || {};
            return i.argAlterKey === 'action';
        });

        console.log({ argv, action, a_action, parsedFlags });

        return; // REMOVER

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
}

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

await main();
