import {Allotment} from "allotment";
import 'allotment/dist/style.css';
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import styled from "styled-components";

const StyleHeaderContainer = styled.div`
	height: 50px;
`

const StyleContainer = styled.div`
	height: calc(100% - 50px);
`

export default function ReactPlayground(){

	return (
		<div style={{height:'100vh'}}>
			<StyleHeaderContainer>
				<Header/>
			</StyleHeaderContainer>
			<StyleContainer>
				<Allotment defaultSizes={[100,100]}>
					<Allotment.Pane minSize={500}>
						<CodeEditor/>
					</Allotment.Pane>
					<Allotment.Pane minSize={0}>
						<Preview/>
					</Allotment.Pane>
				</Allotment>
			</StyleContainer>
		</div>
	)
}