import {Files} from "@/ReactPlayground/PlaygroundContext.tsx";
import {getLanguageFromFileName} from "@/ReactPlayground/untils";
import importMap from './template/import-map.json?raw'
import AppCss from './template/App.css?raw'
import App from './template/App.tsx?raw'
import main from './template/main.tsx?raw'


// app 文件名
export const APP_COMPONENT_FILE_NAME = 'App.tsx'
// import-map映射文件名
export const IMPORT_MAP_FILE_NAME = 'import-map.json'
// 入口文件名
export const ENTRY_FILE_NAME = 'main.tsx'

export const initFiles:Files = {
	[APP_COMPONENT_FILE_NAME]:{
		name:APP_COMPONENT_FILE_NAME,
		language:getLanguageFromFileName(APP_COMPONENT_FILE_NAME),
		value:App,
	},
	'App.css':{
		name:'App.css',
		language:'css',
		value:AppCss,
	},
	[ENTRY_FILE_NAME]:{
		name:ENTRY_FILE_NAME,
		language:getLanguageFromFileName(ENTRY_FILE_NAME),
		value:main,
	},
	[IMPORT_MAP_FILE_NAME]:{
		name:IMPORT_MAP_FILE_NAME,
		language:getLanguageFromFileName(IMPORT_MAP_FILE_NAME),
		value:importMap
	},
}