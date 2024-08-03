import {Files} from "@/ReactPlayground/PlaygroundContext.tsx";
import {transform} from "@babel/standalone";

import {ENTRY_FILE_NAME} from "@/ReactPlayground/files.ts";
import {EditorFile} from "@/ReactPlayground/components/CodeEditor/Editor";


export function babelTransform(fileName:string,code:string,files:Files){
	const _code = beforeTransform(fileName,code)
	let result = '';
	try {
		result = transform(_code,{
			presets:['react','typescript'],
			plugins:[importTransformPlugin(files)],
			filename:fileName,
			retainLines:true
		}).code!
	}catch (e){
		console.error('编译出错', e);
	}
	return result
}

export function importTransformPlugin(files:Files){
	return {
		visitor:{
			ImportDeclaration(path:any){
				const modulePath:string = path.node.source.value;
				if (modulePath.startsWith('.')){
					const file = getModuleFile(files,modulePath)
					if (!file){
						return
					}
					if (file.name.endsWith('.css')){
						path.node.source.value = cssTransformJs(file)
					}else if (file.name.endsWith('.json')){
						path.node.source.value = jsonTransformJs(file)
					}else {
						path.node.source.value = URL.createObjectURL(new Blob([babelTransform(file.name,file.value,files)],{
							type:'application/javascript'
						}))
					}
				}
			}
		}
	}
}

export function getModuleFile(files:Files,modulePath:string){
	let moduleName = modulePath.split('./').pop() || ''
	if (!moduleName.includes('.')){
		const realModuleName = Object.keys(files).filter(name=>{
			return name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js') || name.endsWith('.jsx')
		}).find(name=>{
			return name.split('.').includes(moduleName)
		})
		if (realModuleName){
			moduleName = realModuleName
		}
	}
	return files[moduleName]
}

function jsonTransformJs(file:EditorFile){
	const js = `export default ${file.value}`
	return URL.createObjectURL(new Blob([js],{
		type:'application/javascript'
	}))
}

function cssTransformJs(file:EditorFile){
	const randomId = new Date().getTime()
	const js = `
		(() => {
		    const stylesheet = document.createElement('style')
		    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
		    document.head.appendChild(stylesheet)
		
		    const styles = document.createTextNode(\`${file.value}\`)
		    stylesheet.innerHTML = ''
		    stylesheet.appendChild(styles)
		})()
    `
	return URL.createObjectURL(new Blob([js],{
		type:'application/javascript'
	}))
}

function beforeTransform(fileName:string,code:string){
	const regexReact = /import\s+React/g
	if ((fileName.endsWith('.jsx') || fileName.endsWith('tsx')) && !regexReact.test(code)){
		code = `import React from 'react';\n${code}`
	}
	return code
}

export function compile(files: Files){
	const main = files[ENTRY_FILE_NAME]
	return babelTransform(ENTRY_FILE_NAME, main.value, files)
}

self.addEventListener('message',async ({data})=>{
	try {
		self.postMessage({
			type:'COMPILED_CODE',
			data: compile(data)
		})
	}catch (e){
		self.postMessage({
			type:'ERROR',
			error:e
		})
	}
})