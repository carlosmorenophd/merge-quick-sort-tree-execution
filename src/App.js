import { Box } from "@mui/material";
import { TitleBar } from "./components/TitleBar";
import BodyUi from "./components/BodyUi";


function App() {
  return (
    <Box sx={{ width: "100%", m: 1, p: 1 }} height="100vh">
      <TitleBar title="Sort array of number by merge ad quick sort" />
      <BodyUi />
    </Box>
  );
}

export default App;
