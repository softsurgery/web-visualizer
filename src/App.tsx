import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { MainView } from "@/components/main/MainView";
import { SettingsView } from "@/components/main/SettingsView";
import { WebsiteDetailsView } from "@/components/main/WebsiteDetailsView";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<MainView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/details/:urlId" element={<WebsiteDetailsView />} />
      </Routes>
    </Layout>
  );
}

export default App;
