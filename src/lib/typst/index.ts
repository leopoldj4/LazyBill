import { $typst } from '@myriaddreamin/typst.ts';

import typstCompilerWasm from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import typstRendererWasm from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';

$typst.setRendererInitOptions({
	getModule: () => typstRendererWasm,
});

$typst.setCompilerInitOptions({
	getModule: () => typstCompilerWasm,
});

const typst = $typst;
export default typst;