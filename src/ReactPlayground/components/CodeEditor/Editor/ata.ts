import {setupTypeAcquisition} from '@typescript/ata'
import typescript from 'typescript';

export function createATA(onDownloadFile: (code: string, path: string) => void) {
	return setupTypeAcquisition({
		projectName: 'my-ata',
		typescript: typescript,
		logger: console,
		delegate: {
			receivedFile: (code, path) => {
				onDownloadFile(code, path);
			}
		},
	});
}
