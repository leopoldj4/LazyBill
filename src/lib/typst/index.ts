import { $typst, FetchPackageRegistry, MemoryAccessModel, loadFonts } from '@myriaddreamin/typst.ts';
import { withAccessModel, withPackageRegistry } from '@myriaddreamin/typst.ts/options.init';

import typstCompilerWasm from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import typstRendererWasm from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';

class LocalPackageRegistry extends FetchPackageRegistry {
	override resolvePath(path: { name: string; version: string }) {
		return `/packages/${path.name}-${path.version}.tgz`;
	}
}

const accessModel = new MemoryAccessModel();

$typst.setRendererInitOptions({
	getModule: () => typstRendererWasm,
});

$typst.setCompilerInitOptions({
	getModule: () => typstCompilerWasm,
	beforeBuild: [
		loadFonts(
			[
				'/fonts/AtkinsonHyperlegible-Regular.ttf',
				'/fonts/AtkinsonHyperlegible-Bold.ttf',
				'/fonts/AtkinsonHyperlegible-Italic.ttf',
				'/fonts/AtkinsonHyperlegible-BoldItalic.ttf',
			],
			{ assets: false },
		),
	],
});

// Register via $typst.use() so the auto-registered remote FetchPackageRegistry is suppressed
$typst.use(
	{
		key: 'access-model',
		forRoles: ['compiler'] as const,
		provides: [withAccessModel(accessModel)],
	},
	{
		key: 'package-registry',
		forRoles: ['compiler'] as const,
		provides: [withPackageRegistry(new LocalPackageRegistry(accessModel))],
	},
);

const typst = $typst;
export default typst;