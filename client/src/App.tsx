import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import BookTrip from "@/pages/BookTrip";
import { createContext, useState } from "react";

// Create user context
type User = {
  id: number;
  username: string;
  fullName: string;
  membershipLevel: string;
  journeysCompleted: number;
  destinationsVisited: number;
  totalDaysInSpace: number;
  loyaltyPoints: number;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/book" component={BookTrip} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<User>(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={{ user, setUser, logout }}>
        <Router />
        <Toaster />
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
