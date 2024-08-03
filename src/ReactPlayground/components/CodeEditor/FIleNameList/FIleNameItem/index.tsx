import styled, {css} from "styled-components";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Popconfirm} from "antd";

const StyleFileNameItem = styled.div<{$actived:boolean,$isEditing:boolean}>`
	display: inline-flex;
	padding: 8px 10px 6px;
	font-size: 13px;
	line-height: 20px;
	cursor: pointer;
	font-family: Arial,serif;
	border-bottom: 3px solid transparent;
	${props => props.$actived && css`
		color: ${props.theme.activeText};
		border-bottom: 3px solid ${props.theme.activeText};
	`}
	${props => props.$isEditing && css`
		background-color: ${props.theme.editingBg};
		cursor: text;
	`}
`

const StyleInput = styled.input<{$actived:boolean,$isEditing:boolean,$width:number}>`
	text-align: center;
	font-size: 13px;
	line-height: 20px;
	font-family: Arial,serif;
	box-sizing: border-box;
	border: none;
	outline: none;
	cursor: pointer;
	min-width: 50px;
	width: ${props => props.$width}ch;
	color: ${props => props.theme.text};
	background-color: ${props => props.theme.bg};
	${props => props.$actived && css`
		color: ${props.theme.activeText};
	`}
	${props => props.$isEditing && css`
		background-color: ${props.theme.editingBg};
		cursor: text;
	`}
`

const StyleSpan = styled.span`
	margin-left: 5px;
	line-height: 20px;
	display: flex;
	align-items: center;
	cursor: pointer;
	&:hover{
		transform: scale(1.5);
	}
`

export interface FIleNameItemProps{
	value:string,
	actived:boolean,
	creating:boolean,
	onClick:()=>void,
	onRemove:()=>void,
	onEditComplete:(newName:string)=>void,
	readonly:boolean
}

export function FIleNameItem(props:FIleNameItemProps){
	const {
		value,
		actived = false,
		creating,
		onClick,
		onRemove,
		onEditComplete,
		readonly
	} = props

	const inputRef = useRef<HTMLInputElement>(null)
	const [name,setName] = useState(value)
	const [isEditing,setIsEditing] = useState<boolean>(creating)
	const [inputWidth,setInputWidth] = useState<number>(value.length)

	const handleDoubleClick = ()=>{
		if (readonly){
			return
		}
		setIsEditing(true)
		setTimeout(()=>{
			inputRef.current?.focus()
		},0)
	}

	const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
		setName(e.target.value)
		setInputWidth(e.target.value.length)
	}

	const handleBlur = ()=>{
		setIsEditing(false)
		if (name === ''){
			setName(value)
			setInputWidth(value.length)
			return
		}
		onEditComplete(name)
	}

	useEffect(() => {
		if (creating && inputRef.current){
			inputRef.current.focus()
		}
	}, [creating]);

	return (
		<StyleFileNameItem
			$actived={actived}
			$isEditing={isEditing}
			onClick={onClick}
			onDoubleClick={handleDoubleClick}>
			<StyleInput
				ref={inputRef}
				readOnly={!isEditing}
				type={'text'}
				value={name}
				onChange={handleChange}
				onBlur={handleBlur}
				$isEditing={isEditing}
				$actived={actived}
				$width={inputWidth}
			/>
			{
				!readonly && (
					<Popconfirm
						title={'确定删除该文件吗？'}
						okText={'确定'}
						cancelText={'取消'}
						onConfirm={(e)=>{
							e?.stopPropagation()
							onRemove()
						}}
					>
						<StyleSpan>
							<svg width='12' height='12' viewBox='0 0 24 24'>
								<line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
								<line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
							</svg>
						</StyleSpan>
					</Popconfirm>
				)
			}
		</StyleFileNameItem>
	)
}