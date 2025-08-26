import { readFileSync } from 'node:fs';

export function loadEnv(path = '.env') {
    const content = readFileSync(path, 'utf-8');

    const env = {};
    content.split('\n').map((line) => {
        const [key, value] = line.split('=');

        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });

    return env;
}
