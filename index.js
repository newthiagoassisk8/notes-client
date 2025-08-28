#!/usr/bin/env tsx
import { loadEnv } from './helpers/envloader';

const env = loadEnv() || {};
const API_URL = env?.API_URL;

const DEFAULT_ACTION = 'help';
const ALLOWED_ACTIONS = [
    'list',
    '--list',
    'ls',
    '--ls',
    'l',
    '-l',
    'add',
    '--add',
    'new',
    '--new',
    'delete',
    '--delete',
    'del',
    '--del',
    'rm',
    '--rm',
    'help',
    '--help',
    'h',
    '-h',
    'output',
    '--output',
    '--json',
    '--plain',
    //
];

/*
@id:nhoizey.gremlins @id:fabiospampinato.vscode-highlight @id:vincaslt.highlight-matching-tag @id:ms-vscode.vscode-typescript-next
*/

function parseArgs(argv = null) {
    argv = Array.isArray(argv) ? argv : process.argv.slice(2);
    // argv = [ '--color=true', '--json', '--output=json', '--db-dir=~/.my-notes', '-T', '-q', '-v', './my-dir' ] // REMOVER

    let action = null;
    let actionData = null;

    const parsedArgv = {
        argv,
        action,
        actionData,
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

    action =
        parsedArgv.parsedFlags.find((i) => {
            i = i || {};
            return i.argAlterKey === 'action';
        }) || null;

    if (!action && ALLOWED_ACTIONS.includes(argv[0] || DEFAULT_ACTION)) {
        action = argv[0] || DEFAULT_ACTION;
        actionData = {
            arg: action,
            isAFlag: false,
            isABooleanFlag: false,
            argKey: null,
            argAlterKey: 'action',
            argValue: action,
        };

        parsedArgv.action = action;
        parsedArgv.actionData = actionData;

        parsedArgv.parsedFlags.push(actionData);
    }

    return parsedArgv;
}

function getParsedArgsData(parsedArgsData = null) {
    if (!parsedArgsData || typeof parsedArgsData !== 'object' || Array.isArray(parsedArgsData)) {
        return parseArgs() || {};
    }

    return parsedArgsData || parseArgs() || {};
}

function getArgData(argKey, parsedArgsData = null) {
    if (typeof argKey !== 'string') {
        return null;
    }

    parsedArgsData = getParsedArgsData(parsedArgsData);

    return (parsedArgsData?.parsedFlags || []).find((i) => i.argAlterKey === argKey || i.argKey === argKey) || null;
}

function isQuietMode(parsedArgsData = null) {
    try {
        parsedArgsData = getParsedArgsData(parsedArgsData);
        let output = (getArgData('output')?.argValue || '').toLowerCase().trim() || 'stdout';
        let quietMode = Boolean(getArgData('quiet') ?? getArgData('q'));

        if (quietMode) {
            return true;
        }

        quietMode = !quietMode ? ['clear', 'no-one', 'never', 'quiet'].includes(output) : quietMode;

        return quietMode;
    } catch (error) {
        return false;
    }
}

async function addNote(parsedArgsData = null) {
    parsedArgsData = getParsedArgsData(parsedArgsData);

    let quietMode = isQuietMode(parsedArgsData);

    let title = getArgData('title')?.argValue;
    let output = getArgData('output')?.argValue;
    let content = getArgData('content')?.argValue;
    let tags = getArgData('tags')?.argValue;

    title = typeof title === 'string' ? title : null;
    content = typeof content === 'string' ? content : null;
    tags = (typeof tags === 'string' ? tags : '')
        .split(',')
        .map((i) => i.trim())
        .filter((i) => /^([a-zA-Z0-9\_\-]){1,}$/g.test(i));

    if (!title || !content) {
        console.error(`Itens obrigatórios: [title, content]`);
        process.exit(20);
    }

    const res = await fetch(`${API_URL}/notes/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
            content,
            tags,
        }),
    });

    if (!res.ok) {
        throw new Error('Erro na requisição: ' + response.status);
    }

    let createdNoteInfo = await res.json();
    output = (output || '').toLowerCase().trim() || 'stdout';

    if (output && output === 'json') {
        console.log(
            JSON.stringify({
                success: true,
                note: createdNoteInfo,
            })
        );
        process.exit(0);
    }

    if (quietMode) {
        process.exit(0);
    }

    if (output && ['plain-text', 'text'].includes(output)) {
        console.log(
            JSON.stringify({
                success: true,
                note: createdNoteInfo,
            })
        );
        process.exit(0);
    }

    console.log(`✅ Nota criada %s`, createdNoteInfo?.id);
    process.exit(0);
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

async function deleteNote(parsedArgsData = null) {
    parsedArgsData = getParsedArgsData(parsedArgsData);

    let quietMode = isQuietMode(parsedArgsData);

    try {
        let noteId = getArgData('id');
        await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' });
        if (!res.ok) {
            if (quietMode) {
                process.exit(35);
            }

            throw new Error('Erro na requisição: ');
        }

        process.exit(0);
    } catch (error) {
        if (quietMode) {
            process.exit(37);
        }

        throw new Error(`Error: ${error?.message || error}`);
    }
}

async function main() {
    try {
        const parsedArgsData = getParsedArgsData(null);
        let quietMode = isQuietMode(parsedArgsData);

        // const {
        //     argv,
        //     action,
        //     actionData,
        //     parsedFlags,
        // } = parsedArgsData;

        let intentAction = parsedArgsData?.action || parsedArgsData?.actionData?.argAlterKey || DEFAULT_ACTION;

        intentAction = ALLOWED_ACTIONS.includes(intentAction) ? intentAction : DEFAULT_ACTION;

        switch (intentAction) {
            case 'list':
            case 'ls':
                console.log(await getNotes(parsedArgsData));
                break;

            case 'add':
            case '--add':
            case 'new':
            case '--new':
                await addNote(parsedArgsData);
                break;

            case 'delete':
            case 'del':
            case 'rm':
            case '--delete':
            case '--del':
            case '--rm':
                await deleteNote(parsedArgsData);
                break;

            case 'help':
            case '--help':
            case 'h':
            case '-h':
                printHelp(parsedArgsData);
                process.exit(0);
            default:
                console.error(`Comando desconhecido: ${parsedArgsData?.action}\n`);
                printHelp(parsedArgsData);
                process.exit(2);
        }
    } catch (err) {
        console.error('Erro:', err?.message || err);
        process.exit(15);
    }
}

function printHelp(parsedArgsData = null) {
    parsedArgsData = getParsedArgsData(parsedArgsData);
    console.log(`
  Usage:
    notes list
    notes add --title "Minha nota" --content "Conteúdo" [--tags tag1,tag2]
    notes add --title='My Note Title' --content='My note content' --tags='tag1,tag2'
    notes delete --id 123

  Flags comuns:
    --title       Título da nota
    --content     Conteúdo da nota
    --tags        Lista separada por vírgula
    --id          Id da nota (para delete)
  `);
}

await main();
