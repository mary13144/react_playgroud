import {useEffect, useState} from "react";
import styled from "styled-components";


const StyleMessage = styled.div`
	&.error {
		--color: #f56c6c;
		--bg-color: #fef0f0;
	}

	&.warn {
		--color: #e6a23c;
		--bg-color: #fdf6ec;
	}
	position: absolute;
	right: 8px;
	bottom: 0;
	left: 8px;
	z-index: 10;
	display: flex;
	max-height: calc(100% - 300px);
	min-height: 40px;
	margin-bottom: 8px;
	border: 2px solid var(--color);
	border-radius: 6px;
	color: var(--color);
	background-color: var(--bg-color);
`

const StylePre = styled.pre`
	padding: 12px 20px;
	margin: 0;
	overflow: auto;
	white-space: break-spaces;
`

const StyleButton = styled.button`
	position: absolute;
	top: 2px;
	right: 2px;
	display: block;
	width: 18px;
	height: 18px;
	padding: 0;
	font-size: 9px;
	line-height: 18px;
	text-align: center;
	cursor: pointer;
	border: none;
	border-radius: 9px;
	color: var(--bg-color);
	background-color: var(--color);
`

export interface MessageProps{
	type: 'error' | 'warn',
	content:string
}

export function Message(props:MessageProps){
	const {
		type,
		content,
	} = props

	const [visible, setVisible] = useState(false)

	useEffect(() => {
		setVisible(!!content)
	}, [content])

	return (
		visible ? (
			<StyleMessage className={type}>
				<StylePre dangerouslySetInnerHTML={{__html:content}}></StylePre>
				<StyleButton onClick={()=>setVisible(false)}>✕</StyleButton>
			</StyleMessage>
		) : null
	)
}