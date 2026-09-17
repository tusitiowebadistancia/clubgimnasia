import AppRouter from "./routes/AppRouter";
import StructuredData from "./components/common/StructuredData";
import BrowserFixes from "./utils/BrowserFixes";
export default function App() {
  return (
    <>
    <BrowserFixes />
      <StructuredData />
      <AppRouter />
    </>
  );
}