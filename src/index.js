import { createRoot } from "react-dom/client";

import LogViewer from "./LogViewer";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(<LogViewer />);
