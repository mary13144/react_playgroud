import MonacoEditor, {EditorProps, Monaco, OnMount} from '@monaco-editor/react'
import {editor} from "monaco-editor";
import {createATA} from "./ata.ts";
import {useContext} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";


export interface EditorFile {
	name: string;
	value: string;
	language: string;
}

interface Props {
	file: EditorFile;
	onChange?: EditorProps['onChange'];
	options?: editor.IStandaloneEditorConstructionOptions;
}

export default function Editor(props: Props) {

	const {file, onChange, options} = props

	const {theme} = useContext(PlaygroundContext)

	const handleEditorMount:OnMount = (editor:editor.IStandaloneCodeEditor,monaco:Monaco)=>{
		editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyJ, () => {
			editor.getAction('editor.action.formatDocument')?.run()
		});

		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			jsx:monaco.languages.typescript.JsxEmit.Preserve,
			esModuleInterop: true,
		})

		const ata = createATA((code, path)=>{
			monaco.languages.typescript.typescriptDefaults.addExtraLib(code,`file://${path}`)
		})

		editor.onDidChangeModelContent(()=>{
			ata(editor.getValue())
		})

		ata(editor.getValue())
	}

	return (
		<MonacoEditor
			height='100%'
			path={file.name}
			language={file.language}
			onMount={handleEditorMount}
			onChange={onChange}
			value={file.value}
			theme={theme === 'light' ? 'light' : 'vs-dark'}
			options={
				{
					fontSize:14,
					scrollBeyondLastLine:false,
					minimap:{
						enabled:false
					},
					scrollbar:{
						verticalScrollbarSize:6,
						horizontalScrollbarSize:6
					},
					...options
				}
			}
		/>
	)
}