import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { GeocodingAutocomplete } from "../components/GeocodingAutocomplete";
import { socketService } from "../api/socket";
import { bookRide, getRideHistory } from "../api/rides";

type IconComp = React.ElementType;

import {
  ScreenTransition,
  GlassCard,
  Button,
  Input,
  MapBackground,
} from "../components/UI";
import {
  Home,
  MapPin,
  Clock,
  User,
  Search,
  Map as MapIcon,
  Phone,
  MessageSquare,
  AlertOctagon,
  CheckCircle,
  Star,
  Navigation,
  CreditCard,
  ChevronRight,
  Car,
  Bike,
  Truck,
  ArrowRight,
  LogOut,
  MapPin as MapPinIcon,
} from "lucide-react";

export const PassengerModule = () => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    socketService.connect();

    const handleRideStatus = (data: any) => {
      console.log("passenger:ride_status", data);
      if (data.status === "searching_driver") navigate("/passenger/searching");
      else if (data.status === "driver_assigned")
        navigate("/passenger/tracking");
      else if (data.status === "trip_started") navigate("/passenger/active");
      else if (data.status === "trip_completed")
        navigate("/passenger/completion");
      else if (data.status === "no_driver_found") {
        alert("No driver found near you.");
        navigate("/passenger/book");
      }
    };

    const handleDriverAssigned = (data: any) => {
      sessionStorage.setItem("activeDriver", JSON.stringify(data.driver));
    };

    socketService.on("passenger:ride_status", handleRideStatus);
    socketService.on("passenger:driver_assigned", handleDriverAssigned);

    return () => {
      socketService.off("passenger:ride_status", handleRideStatus);
      socketService.off("passenger:driver_assigned", handleDriverAssigned);
    };
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    socketService.disconnect();
    window.location.href = "/login";
  };

  const setScreen = (path: string) => navigate(`/passenger/${path}`);
  const currentScreen = location.pathname.split("/").pop() || "dashboard";

  return (
    <div className="flex bg-dark h-screen overflow-hidden text-white relative">
      <div className="hidden lg:flex w-72 h-full glass-panel border-y-0 border-l-0 rounded-none flex-col z-50">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-bold shadow-[0_0_20px_rgba(255,214,0,0.4)]">
            R
          </div>
          <span className="text-xl font-black tracking-tight">RideApp</span>
        </div>

        <div className="flex-1 py-10 px-4 flex flex-col gap-3">
          {(
            [
              { id: "dashboard", icon: Home as IconComp, label: "Home" },
              { id: "book", icon: MapIcon as IconComp, label: "Book Ride" },
              { id: "history", icon: Clock as IconComp, label: "My Trips" },
              { id: "profile", icon: User as IconComp, label: "My Account" },
            ] as Array<{ id: string; icon: IconComp; label: string }>
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${currentScreen === item.id || (currentScreen !== "dashboard" && currentScreen !== "history" && currentScreen !== "profile" && currentScreen !== "" && item.id === "book") || (item.id === "dashboard" && currentScreen === "") ? "bg-primary text-black font-bold shadow-lg" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon
                  size={22}
                  strokeWidth={currentScreen === item.id ? 2.5 : 2}
                />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={22} />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="lg:hidden glass-panel px-6 py-4 flex justify-between items-center z-40 relative rounded-none border-x-0 border-t-0">
          <div className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
              R
            </div>
            RideApp
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/5 rounded-full"
          >
            <LogOut size={20} className="text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto relative pb-20 lg:pb-0">
          <ScreenTransition keyId={location.pathname} className="h-full">
            <Routes location={location}>
              <Route
                path="dashboard"
                element={
                  <PassengerDashboard setScreen={setScreen} user={user} />
                }
              />
              <Route path="book" element={<BookRide setScreen={setScreen} />} />
              <Route
                path="searching"
                element={<SearchingDriver setScreen={setScreen} />}
              />
              <Route
                path="tracking"
                element={<RideTracking setScreen={setScreen} />}
              />
              <Route
                path="active"
                element={<RideActive setScreen={setScreen} />}
              />
              <Route
                path="completion"
                element={<RideCompletion setScreen={setScreen} />}
              />
              <Route
                path="history"
                element={<RideHistory setScreen={setScreen} />}
              />
              <Route
                path="profile"
                element={
                  <PassengerProfile
                    setScreen={setScreen}
                    user={user}
                    handleLogout={handleLogout}
                  />
                }
              />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ScreenTransition>
        </div>

        <div className="lg:hidden glass-panel absolute bottom-0 left-0 right-0 h-80px flex justify-around items-center px-6 z-40 rounded-none border-x-0 border-b-0 pb-safe">
          {(
            [
              { id: "dashboard", icon: Home as IconComp, label: "Home" },
              { id: "book", icon: MapIcon as IconComp, label: "Book" },
              { id: "history", icon: Clock as IconComp, label: "Trips" },
              { id: "profile", icon: User as IconComp, label: "Profile" },
            ] as Array<{ id: string; icon: IconComp; label: string }>
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${currentScreen === tab.id || (tab.id === "dashboard" && currentScreen === "") || (currentScreen !== "dashboard" && currentScreen !== "history" && currentScreen !== "profile" && currentScreen !== "" && tab.id === "book") ? "text-primary" : "text-white/50"}`}
              >
                <Icon size={24} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PassengerDashboard = ({ setScreen, user }: any) => (
  <div className="max-w-2xl mx-auto p-6">
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">
          Hi, {user.name?.split(" ")[0] || "User"} 👋
        </h1>
        <p className="text-white/50">Where are we going today?</p>
      </div>
    </div>
    <GlassCard
      className="mb-8 bg-linear-to-br from-primary/20 to-transparent border-primary/30 cursor-pointer"
      onClick={() => setScreen("book")}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Book a Ride</h2>
          <p className="text-sm text-white/70">
            Get to your destination quickly
          </p>
        </div>
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black">
          <ArrowRight />
        </div>
      </div>
    </GlassCard>
  </div>
);

const BookRide = ({ setScreen }: any) => {
  const [pickup, setPickup] = useState<any>(null);
  const [drop, setDrop] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        () => console.warn('Geolocation blocked or unavailable.'),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (pickup && pickup.lat && pickup.lng && drop && drop.lat && drop.lng) {
      // Calculate route
      fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRoute(coords);
          }
        })
        .catch(err => console.error(err));
    } else {
      setRoute([]);
      if (pickup && pickup.lat && pickup.lng) setMapCenter([pickup.lat, pickup.lng]);
      else if (drop && drop.lat && drop.lng) setMapCenter([drop.lat, drop.lng]);
    }
  }, [pickup, drop]);

  const handleBook = async () => {
    if (!pickup || !drop) {
      alert("Please select both Pickup and Dropoff locations.");
      return;
    }
    setLoading(true);
    try {
      await bookRide({
        pickup: {
          address: pickup.address,
          location: { type: "Point", coordinates: [pickup.lng, pickup.lat] },
        },
        drop: {
          address: drop.address,
          location: { type: "Point", coordinates: [drop.lng, drop.lat] },
        },
        rideType: "solo",
      });
      setScreen("searching");
    } catch (e: any) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  const markers = [];
  if (pickup && pickup.lat && pickup.lng) markers.push({ position: [pickup.lat, pickup.lng], color: '#E6C200' });
  if (drop && drop.lat && drop.lng) markers.push({ position: [drop.lat, drop.lng], color: '#ef4444' });

  return (
    <MapBackground center={mapCenter} markers={markers} route={route}>
      <div className="absolute top-6 left-6 right-6 z-1000 space-y-3">
        <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <GeocodingAutocomplete
              placeholder="Current Location"
              onChange={setPickup}
              className="bg-transparent border-b border-white/10 w-full pb-2 focus:outline-none focus:border-primary text-sm text-white placeholder-white/50"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-sm bg-red-500 shrink-0" />
            <GeocodingAutocomplete
              placeholder="Where to?"
              onChange={setDrop}
              className="bg-transparent border-b border-white/10 w-full pb-2 focus:outline-none focus:border-primary text-sm text-white placeholder-white/50"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-1000 animate-in slide-in-from-bottom duration-300">
        <h3 className="font-bold mb-4">Select Vehicle</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 mb-4 snap-x">
          {(
            [
              {
                icon: Car as IconComp,
                name: "Mini",
                price: "₹12",
                time: "3 min",
                selected: true,
              },
              {
                icon: Truck as IconComp,
                name: "SUV",
                price: "₹18",
                time: "6 min",
              },
            ] as Array<{
              icon: IconComp;
              name: string;
              price: string;
              time: string;
              selected?: boolean;
            }>
          ).map((v, i) => {
            const VehicleIcon = v.icon;
            return (
              <div
                key={i}
                className={`min-w-100px p-4 rounded-2xl border snap-center cursor-pointer transition-colors ${v.selected ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"}`}
              >
                <VehicleIcon
                  className={`mb-2 ${v.selected ? "text-primary" : "text-white/50"}`}
                />
                <div className="font-bold">{v.name}</div>
                <div className="text-sm text-white/70">{v.price}</div>
                <div className="text-xs text-white/40 mt-1">{v.time}</div>
              </div>
            );
          })}
        </div>
        <Button
          className="w-full"
          onClick={handleBook}
          disabled={loading || !pickup || !drop}
        >
          {loading ? "Booking..." : "Confirm Ride"}
        </Button>
      </div>
    </MapBackground>
  );
};

const SearchingDriver = ({ setScreen }: any) => {
  return (
    <MapBackground>
      <div className="absolute inset-0 flex items-center justify-center z-1000">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 border-2 border-primary rounded-full animate-pulse-ring" />
          <div
            className="absolute w-32 h-32 border-2 border-primary rounded-full animate-pulse-ring"
            style={{ animationDelay: "0.5s" }}
          />
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,214,0,0.5)]">
            <Search className="text-black" size={24} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 left-6 right-6 z-1000 text-center">
        <h2 className="text-xl font-bold mb-2">Finding your driver...</h2>
        <p className="text-white/50 mb-8">
          Connecting you to the nearest available driver
        </p>
        <Button
          variant="danger"
          className="w-full"
          onClick={() => setScreen("book")}
        >
          Cancel Request
        </Button>
      </div>
    </MapBackground>
  );
};

const RideTracking = ({ setScreen }: any) => {
  const driverStr = sessionStorage.getItem("activeDriver");
  const driver = driverStr
    ? JSON.parse(driverStr)
    : {
        name: "Driver",
        vehicleInfo: { model: "Car", plateNumber: "..." },
        averageRating: 5,
      };

  return (
    <MapBackground>
      <div className="absolute top-[30%] left-[40%] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
        <Car className="text-black" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-1000">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-gray-600 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-white">
              {driver.name?.[0] || "D"}
            </div>
            <div>
              <h3 className="font-bold text-lg">{driver.name}</h3>
              <div className="flex items-center gap-1 text-sm text-primary">
                <Star size={14} fill="currentColor" />{" "}
                {parseFloat(driver.averageRating).toFixed(1) || 5.0}
              </div>
              <div className="text-sm text-white/50 mt-1">
                {driver.vehicleInfo?.model} • {driver.vehicleInfo?.plateNumber}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">Map</div>
          </div>
        </div>
        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1 text-sm">
            <Phone size={14} /> Call
          </Button>
          <Button variant="outline" className="flex-1 text-sm">
            <MessageSquare size={14} /> Chat
          </Button>
          <Button variant="danger" className="px-4">
            <AlertOctagon size={14} />
          </Button>
        </div>
      </div>
    </MapBackground>
  );
};

const RideActive = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-1000">
      <GlassCard className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">Ride Active</div>
          <div className="text-sm text-white/50">Tracking your journey</div>
        </div>
      </GlassCard>
    </div>
  </MapBackground>
);

const RideCompletion = ({ setScreen }: any) => {
  const handleDone = () => {
    sessionStorage.removeItem("activeDriver");
    setScreen("dashboard");
  };

  return (
    <div className="p-6 flex flex-col h-full justify-center">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-2">You've Arrived!</h1>
        <p className="text-white/50">Hope you enjoyed your ride.</p>
      </div>
      <GlassCard className="mb-8">
        <h3 className="text-center font-bold mb-4">Rate your driver</h3>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={32}
              className="text-primary cursor-pointer hover:scale-110"
              fill={i <= 4 ? "currentColor" : "none"}
            />
          ))}
        </div>
        <textarea
          className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none mb-4 resize-none"
          placeholder="Leave a compliment..."
          rows={3}
        />
        <Button className="w-full" onClick={handleDone}>
          Done
        </Button>
      </GlassCard>
    </div>
  );
};

const RideHistory = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRideHistory()
      .then(res => setRides(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ride History</h1>
      <div className="flex flex-col gap-4 pb-12">
        {loading ? (
           <div className="flex justify-center p-8"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : rides.length === 0 ? (
          <GlassCard>
            <div className="flex items-center justify-center text-white/50 text-sm py-4">
              No recent rides found.
            </div>
          </GlassCard>
        ) : (
          rides.map(ride => (
            <GlassCard key={ride._id}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white/70">{new Date(ride.createdAt).toLocaleDateString()}</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${ride.status === 'trip_completed' ? 'text-green-400' : ride.status.includes('cancel') ? 'text-red-400' : 'text-primary'}`}>{ride.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-sm truncate mb-1"><span className="text-white/40">From:</span> {ride.pickup?.address}</div>
              <div className="text-sm truncate mb-3"><span className="text-white/40">To:</span> {ride.drop?.address}</div>
              <div className="flex justify-between items-center border-t border-white/5 pt-3">
                 <div className="text-xs text-white/50">{ride.driverId ? `Driver: ${ride.driverId.name}` : 'No driver'}</div>
                  <div className="text-right font-black text-lg text-primary">₹{ride.finalFare || ride.estimatedFare || 0}</div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

const PassengerProfile = ({ setScreen, user, handleLogout }: any) => {
  const [homeLocation, setHomeLocation] = useState<any>(null);
  const [workLocation, setWorkLocation] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary flex items-center justify-center text-3xl font-bold bg-dark text-primary">
          {user?.name?.[0] || "P"}
        </div>
        <h1 className="text-2xl font-bold">{user?.name || "Passenger"}</h1>
        <p className="text-white/50">
          {user?.email || "passenger@example.com"}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Saved Locations</h2>
        <Button
          variant="outline"
          className="text-xs py-1 h-auto"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 w-full">
            <MapPinIcon className="text-primary shrink-0" />
            <div className="flex-1 w-full overflow-hidden">
              <div className="font-bold cursor-pointer">Home</div>
              {isEditing ? (
                <GeocodingAutocomplete
                  defaultValue={homeLocation?.address}
                  onChange={setHomeLocation}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm mt-1 focus:border-primary outline-none"
                  placeholder="Enter home address..."
                />
              ) : (
                <div className="text-sm text-white/50 truncate w-full">
                  {homeLocation?.address || "Not set"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-px bg-white/10 w-full mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-full">
            <Clock className="text-primary shrink-0" />
            <div className="flex-1 w-full overflow-hidden">
              <div className="font-bold cursor-pointer">Work</div>
              {isEditing ? (
                <GeocodingAutocomplete
                  defaultValue={workLocation?.address}
                  onChange={setWorkLocation}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm mt-1 focus:border-primary outline-none"
                  placeholder="Enter work address..."
                />
              ) : (
                <div className="text-sm text-white/50 truncate w-full">
                  {workLocation?.address || "Not set"}
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
