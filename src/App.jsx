import AppRouter from "./routes/AppRouter";
import StructuredData from "./components/common/StructuredData";
import BrowserFixes from "./utils/BrowserFixes";
import SiteOperation from "./components/common/SiteOperation";
export default function App() {
  return (
    <>
    <BrowserFixes />
      <StructuredData />
      <SiteOperation />
      <AppRouter />
    </>
  );
}
