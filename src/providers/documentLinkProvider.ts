'use strict';

import {
    Uri,
    Range,
    Position,
    workspace,
    DocumentLink,
    TextDocument,
    ProviderResult,
    DocumentLinkProvider as vsDocumentLinkProvider,
} from 'vscode'
import * as util from '../util';

export default class DocumentLinkProvider implements vsDocumentLinkProvider {
    provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
        let documentLinks: DocumentLink[] = [];

        const wsPath = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

        if (!wsPath) return;

        const cacheMap = util.getLivewireCacheMap(wsPath);

        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            const matches = line.text.matchAll(util.regexJumpFile);

            for (const match of matches) {
                const startColumn = new Position(
                    line.lineNumber,
                    line.text.indexOf(match[1])
                );
                const endColumn = startColumn.translate(0, match[1].length);
                const jumpPath = cacheMap[match[1]];

                if (jumpPath == undefined) continue;

                documentLinks.push(
                    new DocumentLink(
                        new Range(startColumn, endColumn), Uri.file(jumpPath),
                    )
                );
            }
        }

        return documentLinks;
    }
}
