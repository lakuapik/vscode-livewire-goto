'use strict';

import {
    Hover,
    Position,
    workspace,
    TextDocument,
    MarkdownString,
    ProviderResult,
    HoverProvider as vsHoverProvider,
} from 'vscode';
import * as util from '../util';

export default class HoverProvider implements vsHoverProvider {
    provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
        let ranges = document.getWordRangeAtPosition(position, util.regexJumpFile);

        if (!ranges) return;

        const wsPath = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

        if (!wsPath) return;

        const cacheMap = util.getLivewireCacheMap(wsPath);

        const text = document.getText(ranges);
        const matches = text.matchAll(util.regexJumpFile);

        for (const match of matches) {
            const jumpPath = cacheMap[match[1]];
            const jumpPathShow = jumpPath.replace(wsPath + '/', '');

            const markdown = '\`class:\`' + `[${jumpPathShow}](${jumpPath}) \n`;

            return new Hover(new MarkdownString(markdown));
        }
    }
}
