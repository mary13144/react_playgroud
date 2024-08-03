import {useContext, useEffect, useRef, useState} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";
import iframeRaw from './iframe.html?raw'
import styled from "styled-components";
import {IMPORT_MAP_FILE_NAME} from "@/ReactPlayground/files.ts";
import {Message} from "@/ReactPlayground/components/Preview/Message";
import CompilerWorker from './compiler.worker.ts?worker'
import {debounce} from "lodash-es";

const StylePreview = styled.div`
	height: 100%;
`
const StyleIframe = styled.iframe`
	width: 100%;
	height: 100%;
	padding: 0;
	border: none;
`

interface MessageData {
	data: {
		type: string
		message: string
	}
}

export default function Preview() {

	const {
		files
	} = useContext(PlaygroundContext)

	const importMapValue = files[IMPORT_MAP_FILE_NAME].value
	const workerRef = useRef<Worker>()
	const [compiledCode,setCompiledCode] = useState('')
	const [iframeBlobUrl, setIframeBlobUrl] = useState(getIframeBlobUrl());
	const [errorContent,setErrorContent] = useState<string>('')
	
	function getIframeBlobUrl(){
		const res = iframeRaw.replace(
			'<script type="importmap"></script>',
			`<script type="importmap">${importMapValue}</script>`)
			.replace(
				'<script type="module" id="appSrc"></script>',
				`<script type="module" id="appSrc">${compiledCode}</script>`,
			)
		return URL.createObjectURL(new Blob([res],{ type: 'text/html' }))
	}

	const handleMessage = (msg:MessageData)=>{
		const {type,message} = msg.data
		if (type === 'ERROR'){
			setErrorContent(message)
		}
	}

	useEffect(() => {
		setIframeBlobUrl(getIframeBlobUrl())
	}, [importMapValue,compiledCode]);

	useEffect(debounce(() => {
		workerRef.current?.postMessage(files)
	},500), [files]);

	useEffect(() => {
		window.addEventListener('message',handleMessage)
		if (!workerRef.current){
			workerRef.current = new CompilerWorker()
			workerRef.current?.addEventListener('message',({data})=>{
				if (data.type === 'COMPILED_CODE'){
					setCompiledCode(data.data)
				}else{
					setErrorContent(data.error)
				}
			})
		}
		return ()=>{
			window.removeEventListener('message',handleMessage)
		}
	}, []);

	return (
		<StylePreview>
			<StyleIframe src={iframeBlobUrl}/>
			<Message type={'error'} content={errorContent}/>
		</StylePreview>
	)
}