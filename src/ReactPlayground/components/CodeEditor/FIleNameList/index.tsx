import {useContext, useEffect, useRef, useState} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";
import {FIleNameItem} from "@/ReactPlayground/components/CodeEditor/FIleNameList/FIleNameItem";
import styled from "styled-components";
import {
	APP_COMPONENT_FILE_NAME,
	ENTRY_FILE_NAME,
	IMPORT_MAP_FILE_NAME,
	TSCONFIG_FILE_NAME
} from "@/ReactPlayground/files.ts";

const StyleFileNameList = styled.div`
	display: flex;
	align-items: center;
	height: 38px;
	width: 100%;
	overflow-x: auto;
	overflow-y: hidden;
	border-bottom: 1px solid ${props => props.theme.border};
	box-sizing: border-box;
	color: ${props => props.theme.text};
	background-color: ${props => props.theme.bg};
	position: relative;
	&::-webkit-scrollbar {
		height: 1px;
	}

	&::-webkit-scrollbar-track {
		background-color: ${props => props.theme.border};
	}

	&::-webkit-scrollbar-thumb {
		background-color: ${props => props.theme.border};
	}
`
const StyleAdd = styled.div`
	text-align: center;
	cursor: pointer;
`
const StyleConfig = styled.div`
	position: sticky;
	top: 0;
	right: 0;
	z-index: 9999;
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

	const containerRef = useRef<HTMLDivElement>(null)
	const [tabs,setTabs] = useState<string[]>([''])
	const [creating,setCreating] = useState<boolean>(false)
	const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME,TSCONFIG_FILE_NAME];
	const rightFileNames = [IMPORT_MAP_FILE_NAME]


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

	const handleWheel = (e:WheelEvent) => {
		if (e.deltaY !== 0 && containerRef.current) {
			e.preventDefault();
			containerRef.current.scrollLeft += e.deltaY;
		}
	}

	useEffect(() => {
		containerRef.current?.addEventListener('wheel',handleWheel)
		return ()=>{
			containerRef.current?.removeEventListener('wheel',handleWheel)
		}
	}, []);

	useEffect(() => {
		setTabs(Object.keys(files))
	}, [files]);

	return (
		<StyleFileNameList ref={containerRef}>
			{
				tabs.filter((fileName)=>{
					return !rightFileNames.includes(fileName)
				}).map((fileName,index,array)=>(
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
			<StyleConfig>
				{
					rightFileNames.map((fileName,index)=>(
						<FIleNameItem
							value={fileName}
							creating={false}
							actived={fileName === selectedFileName}
							readonly={true}
							onClick={()=>setSelectFileName(fileName)}
							key={fileName+index}
						/>
					))
				}
			</StyleConfig>
		</StyleFileNameList>
	)
}