import ReactPlayground from "./ReactPlayground";
import {createGlobalStyle} from "styled-components";
import {PlaygroundProvider} from "./ReactPlayground/PlaygroundContext.tsx";
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
`;
function App() {

  return (
    <>
        <GlobalStyle/>
        <PlaygroundProvider>
            <ReactPlayground/>
        </PlaygroundProvider>
    </>
  )
}

export default App
