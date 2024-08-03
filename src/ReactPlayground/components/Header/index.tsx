import logoSvg from '@/ReactPlayground/icons/logo.svg';
import styled from "styled-components";
import {DownloadOutlined, MoonOutlined, ShareAltOutlined, SunOutlined} from '@ant-design/icons';
import {useContext} from "react";
import {PlaygroundContext} from "@/ReactPlayground/PlaygroundContext.tsx";
import copy from "copy-to-clipboard";
import {message} from "antd";
import {downloadFile} from "@/ReactPlayground/untils";


const StyleHeader = styled.div`
	height: 100%;
	padding: 0 30px;
	box-sizing: border-box;
	border-bottom: 1px solid ${props => props.theme.border};
	color: ${props => props.theme.text};
	background-color: ${props => props.theme.bg};
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const StyleLeft = styled.div`
	display: flex;
	align-items: center;
	font-size: 20px;
	& img{
		height: 24px;
		margin-right: 10px;
	}
	& span{
		font-weight: bold;
	}
`

const StyleRight = styled.div`
	display: flex;
	align-items: center;
	font-size: 20px;
	& > *{
		margin-right: 15px;
	}
	&:last-child{
		margin-right: 0;
	}
`

export default function Header() {

	const {
		theme,
		files,
		setTheme
	} = useContext(PlaygroundContext)

	const handleShare = ()=>{
		copy(window.location.href)
		message.success('分享链接已经复制')
	}

	const handleDown = ()=>{
		downloadFile(files).then(()=>{
			message.success('下载成功')
		}).catch(e=>{
			message.error(`下载失败，error:${e}`)
		})
	}
	return (
		<StyleHeader>
			<StyleLeft>
				<img src={logoSvg} alt="logo"/>
				<span>React Playground</span>
			</StyleLeft>
			<StyleRight>
				{
					theme === 'light' ? (
						<MoonOutlined
							title='切换暗色主题'
							onClick={() => setTheme('dark')}
						/>
					) : (
						<SunOutlined
							title='切换亮色主题'
							onClick={() => setTheme('light')}
						/>
					)
				}
				<ShareAltOutlined
					onClick={handleShare}
				/>
				<DownloadOutlined
					onClick={handleDown}
				/>
			</StyleRight>
		</StyleHeader>
	)
}