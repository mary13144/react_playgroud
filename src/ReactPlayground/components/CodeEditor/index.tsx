import FIleNameList from "./FIleNameList";
import Editor from "./Editor";
import styled from "styled-components";
import {useContext} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";
import {debounce} from "lodash-es";

const StyleCodeEditor = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
`

export default function CodeEditor() {
	const {
		files,
		setFiles,
		selectedFileName
	} = useContext(PlaygroundContext)

	const file = files[selectedFileName]

	const handleEditorChange = (value?:string)=>{
		files[selectedFileName].value = value!
		setFiles({...files})
	}

	return (
		<StyleCodeEditor>
			<FIleNameList/>
			<Editor file={file} onChange={debounce(handleEditorChange,500)}/>
		</StyleCodeEditor>
	)
}