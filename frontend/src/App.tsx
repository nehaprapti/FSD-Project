import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Passenger
import PassengerLogin from "./pages/passenger/Login";
import PassengerSignup from "./pages/passenger/Signup";
import PassengerHome from "./pages/passenger/Home";
import FareEstimate from "./pages/passenger/FareEstimate";
import SearchingDriver from "./pages/passenger/SearchingDriver";
import ActiveRide from "./pages/passenger/ActiveRide";
import TripCompleted from "./pages/passenger/TripCompleted";
import RideHistory from "./pages/passenger/RideHistory";
import PassengerProfile from "./pages/passenger/Profile";
import SharedRide from "./pages/passenger/SharedRide";

// Driver
import DriverLogin from "./pages/driver/Login";
import DriverOnboarding from "./pages/driver/Onboarding";
import DriverDashboard from "./pages/driver/Dashboard";
import DriverRequest from "./pages/driver/Request";
import DriverTrip from "./pages/driver/Trip";
import DriverEarnings from "./pages/driver/Earnings";
import DriverProfile from "./pages/driver/Profile";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminVerification from "./pages/admin/Verification";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminUsers from "./pages/admin/Users";
import AdminRides from "./pages/admin/Rides";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Passenger */}
          <Route path="/passenger/login" element={<PassengerLogin />} />
          <Route path="/passenger/signup" element={<PassengerSignup />} />
          <Route path="/passenger/home" element={<PassengerHome />} />
          <Route path="/passenger/estimate" element={<FareEstimate />} />
          <Route path="/passenger/searching" element={<SearchingDriver />} />
          <Route path="/passenger/ride/:id" element={<ActiveRide />} />
          <Route path="/passenger/completed/:id" element={<TripCompleted />} />
          <Route path="/passenger/history" element={<RideHistory />} />
          <Route path="/passenger/profile" element={<PassengerProfile />} />
          <Route path="/passenger/shared" element={<SharedRide />} />

          {/* Driver */}
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/onboarding" element={<DriverOnboarding />} />
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/request" element={<DriverRequest />} />
          <Route path="/driver/trip/:id" element={<DriverTrip />} />
          <Route path="/driver/earnings" element={<DriverEarnings />} />
          <Route path="/driver/profile" element={<DriverProfile />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verification" element={<AdminVerification />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/rides" element={<AdminRides />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
