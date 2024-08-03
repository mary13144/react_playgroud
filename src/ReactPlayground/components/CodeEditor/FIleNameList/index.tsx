import {useContext, useEffect, useState} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";
import {FIleNameItem} from "@/ReactPlayground/components/CodeEditor/FIleNameList/FIleNameItem";
import styled from "styled-components";
import {APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME} from "@/ReactPlayground/files.ts";

const StyleFileNameList = styled.div`
	display: flex;
	align-items: center;
	height: 38px;
	overflow-x: auto;
	overflow-y: hidden;
	border-bottom: 1px solid ${props => props.theme.border};
	box-sizing: border-box;
	color: ${props => props.theme.text};
	background-color: ${props => props.theme.bg};
	
	&::-webkit-scrollbar {
		height: 1px;
	}

	&::-webkit-scrollbar-track {
		background-color: #ddd;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #ddd;
	}
`
const StyleAdd = styled.div`
	text-align: center;
	cursor: pointer;
`

let Id = 1
export default function FIleNameList() {
	const {
		files,
		selectedFileName,
		setSelectFileName,
		addFile,
		updateFileName,
		removeFile,
	} = useContext(PlaygroundContext)

	const [tabs,setTabs] = useState<string[]>([''])
	const [creating,setCreating] = useState<boolean>(false)
	const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME];


	const handleEditComplete = (oldName:string,newName:string)=>{
		setCreating(false)
		if (oldName===newName){
			return
		}
		updateFileName(oldName,newName)
		setSelectFileName(newName)
	}

	const handleAddFile = ()=>{
		const newFileName = 'Comp' + Id++ + '.tsx'
		addFile(newFileName)
		setSelectFileName(newFileName)
		setCreating(true)
	}

	const handleRemove = (fileName:string)=>{
		removeFile(fileName)
		setSelectFileName(ENTRY_FILE_NAME)
	}

	useEffect(() => {
		setTabs(Object.keys(files))
	}, [files]);

	return (
		<StyleFileNameList>
			{
				tabs.map((fileName,index,array)=>(
					<FIleNameItem
						value={fileName}
						creating={creating && index === array.length-1}
						actived={fileName === selectedFileName}
						readonly={readonlyFileNames.includes(fileName)}
						onClick={()=>setSelectFileName(fileName)}
						onRemove={()=>handleRemove(fileName)}
						onEditComplete={(newName)=>handleEditComplete(fileName,newName)}
						key={fileName+index}
					/>
				))
			}
			<StyleAdd onClick={handleAddFile}>
				+
			</StyleAdd>
		</StyleFileNameList>
	)
}