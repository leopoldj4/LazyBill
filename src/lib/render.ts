import { $typst } from '@myriaddreamin/typst.ts';

import typstCompilerWasm from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import typstRendererWasm from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';

import type { Customer, Company } from "$lib/server/db/schema";


$typst.setRendererInitOptions({
    getModule: () => typstRendererWasm,
});

$typst.setCompilerInitOptions({
    getModule: () => typstCompilerWasm,
});

export const render = async (document: string) => {
    return await $typst.svg({
        mainContent: document,
    });
};
