'use strict';

import * as fs from 'fs';

// TODO: move it to config
export const regexJumpFile = new RegExp('@livewire\\([\'\"](.*?)[\'\"]\\)', 'g');
export const regexCacheMap = new RegExp('\'(.*?)\' \=\> \'(.*?)\'', 'g');

interface CacheMap {
    [key: string]: string
}

export function getLivewireCacheMap(workspacePath: string | undefined): CacheMap {
    let map: CacheMap = {};

    const cacheFile = workspacePath + '/bootstrap/cache/livewire-components.php';

    if (!fs.existsSync(cacheFile)) return map;

    const content = fs.readFileSync(cacheFile, 'utf-8');
    const matches = content.matchAll(regexCacheMap);

    for (const match of matches) {
        map[match[1]] = workspacePath + '/' + convertNamespaceToFilePath(match[2]);
    }

    return map;
}

export function convertNamespaceToFilePath(namespace: string): string {
    // for now, we assume that the namespace is same as the folder structure

    // this replace App\\Http to App/Http. need backslash 8 times, weird.
    namespace = namespace.replace(new RegExp("\\\\\\\\", 'g'), '/');
    // this replace App to app.
    namespace = namespace.replace('App', 'app');

    return namespace + '.php';
}