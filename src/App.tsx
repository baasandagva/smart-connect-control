import { Switch, Route } from "wouter";
import { AppProvider } from "./lib/store";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/settings" component={Settings} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AppProvider>
      <Layout>
        <Router />
      </Layout>
      <Toaster />
    </AppProvider>
  );
}

export default App;
