import {EditorFile} from "./components/CodeEditor/Editor";
import {createContext, PropsWithChildren, useEffect, useState} from "react";
import {compress, getFilesFromUrl, getLanguageFromFileName} from "./untils";
import {initFiles} from "@/ReactPlayground/files.ts";
import {ThemeProvider} from "styled-components";
import {Theme, themes} from "./theme.ts";

export interface Files{
	[key:string]:EditorFile
}

export interface PlaygroundContextType{
	theme:Theme;
	files:Files;
	selectedFileName:string;
	setSelectFileName:(fileName:string)=>void;
	setFiles:(files:Files)=>void;
	setTheme:(theme:Theme)=>void;
	addFile: (fileName: string) => void
	removeFile: (fileName: string) => void
	updateFileName: (oldFieldName: string, newFieldName: string) => void
}

export const PlaygroundContext = createContext<PlaygroundContextType>({
	selectedFileName:'App.tsx',
} as PlaygroundContextType)


export const PlaygroundProvider = (props:PropsWithChildren)=>{
	const {children} = props

	const [files,setFiles] = useState<Files>(getFilesFromUrl() || initFiles)

	const [selectedFileName,setSelectFileName] = useState<string>('App.tsx')

	const [theme,setTheme] = useState<Theme>('dark')

	const addFile:PlaygroundContextType['addFile'] = (fileName)=>{
		files[fileName] = {
			name:fileName,
			language:getLanguageFromFileName(fileName),
			value:''
		}
		setFiles({...files})
	}

	const removeFile:PlaygroundContextType['removeFile'] = (fileName)=>{
		delete files[fileName]
		setFiles({...files})
	}

	const updateFileName:PlaygroundContextType['updateFileName'] = (oldFieldName,newFieldName)=>{
		if (!files[oldFieldName] || !newFieldName){
			return
		}
		const {[oldFieldName]:value,...rest} = files

		const newFile:Files = {
			[newFieldName]:{
				...value,
				name:newFieldName,
				language:getLanguageFromFileName(newFieldName)
			}
		}

		setFiles({
			...rest,
			...newFile
		})
	}

	useEffect(() => {
		window.location.hash = compress(JSON.stringify(files))
	}, [files]);

	return (
		<PlaygroundContext.Provider value={{
			theme,
			files,
			selectedFileName,
			setFiles,
			setTheme,
			setSelectFileName,
			addFile,
			removeFile,
			updateFileName
		}}>
			<ThemeProvider theme={themes[theme]}>
				{children}
			</ThemeProvider>
		</PlaygroundContext.Provider>
	)
}