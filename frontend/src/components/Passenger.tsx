import React, { useState } from "react";
import {
  ScreenTransition,
  GlassCard,
  Button,
  Input,
  MapBackground,
} from "./UI";
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
  Tag,
  ChevronRight,
  Menu,
  MapPin as MapPinIcon,
  Car,
  Bike,
  Truck,
  ArrowRight,
  LogOut,
} from "lucide-react";

export const PassengerModule = () => {
  const [screen, setScreen] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <PassengerDashboard setScreen={setScreen} user={user} />;
      case "book":
        return <BookRide setScreen={setScreen} />;
      case "searching":
        return <SearchingDriver setScreen={setScreen} />;
      case "tracking":
        return <RideTracking setScreen={setScreen} />;
      case "active":
        return <RideActive setScreen={setScreen} />;
      case "completion":
        return <RideCompletion setScreen={setScreen} />;
      case "history":
        return <RideHistory setScreen={setScreen} />;
      case "profile":
        return (
          <PassengerProfile
            setScreen={setScreen}
            user={user}
            handleLogout={handleLogout}
          />
        );
      default:
        return <PassengerDashboard setScreen={setScreen} user={user} />;
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <div className="glass-panel px-6 py-4 flex justify-between items-center z-40 absolute top-0 left-0 right-0 rounded-none border-x-0 border-t-0">
        <div className="font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black">
            R
          </div>
          RideApp
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold leading-none">
              {user.name || "User"}
            </div>
            <div className="text-[10px] text-white/50 leading-none mt-1">
              Passenger
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 bg-white/5 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 pt-[72px] pb-[80px] overflow-y-auto relative">
        <ScreenTransition keyId={screen} className="h-full">
          {renderScreen()}
        </ScreenTransition>
      </div>

      <div className="glass-panel absolute bottom-0 left-0 right-0 h-[80px] flex justify-around items-center px-6 z-40 rounded-none border-x-0 border-b-0">
        {[
          { id: "dashboard", icon: Home, label: "Home" },
          { id: "book", icon: MapIcon, label: "Book" },
          { id: "history", icon: Clock, label: "History" },
          { id: "profile", icon: User, label: "Profile" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${screen === tab.id || (screen !== "dashboard" && screen !== "history" && screen !== "profile" && tab.id === "book") ? "text-primary" : "text-white/50 hover:text-white"}`}
          >
            <tab.icon size={24} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const PassengerDashboard = ({ setScreen, user }: any) => (
  <div className="p-6">
    <div className="mb-8">
      <h1 className="text-2xl font-bold">
        Hi, {user.name?.split(" ")[0] || "User"} 👋
      </h1>
      <p className="text-white/50">Where are we going today?</p>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-4 mb-4 snap-x">
      {[
        { label: "Total Rides", value: "42" },
        { label: "Distance", value: "340 km" },
        { label: "Spent", value: "$450" },
      ].map((stat, i) => (
        <GlassCard key={i} className="min-w-[140px] snap-center">
          <div className="text-white/50 text-sm mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
        </GlassCard>
      ))}
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
    <h3 className="font-bold mb-4">Recent Rides</h3>
    <div className="flex flex-col gap-4">
      {[1, 2].map((i) => (
        <GlassCard
          key={i}
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setScreen("history")}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-medium">Downtown → Airport</div>
              <div className="text-xs text-white/50">Yesterday, 10:30 AM</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">$24.50</div>
            <div className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full mt-1">
              Completed
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const BookRide = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <input
            className="bg-transparent border-b border-white/10 w-full pb-2 focus:outline-none focus:border-primary"
            placeholder="Current Location"
            defaultValue="123 Main St"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-sm bg-red-500" />
          <input
            className="bg-transparent border-b border-white/10 w-full pb-2 focus:outline-none focus:border-primary"
            placeholder="Where to?"
            autoFocus
          />
        </div>
      </GlassCard>
    </div>
    <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-10 animate-in slide-in-from-bottom duration-300">
      <h3 className="font-bold mb-4">Select Vehicle</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-4 snap-x">
        {[
          { icon: Bike, name: "Bike", price: "$5", time: "2 min" },
          { icon: Car, name: "Auto", price: "$8", time: "4 min" },
          {
            icon: Car,
            name: "Mini",
            price: "$12",
            time: "3 min",
            selected: true,
          },
          { icon: Truck, name: "SUV", price: "$18", time: "6 min" },
        ].map((v, i) => (
          <div
            key={i}
            className={`min-w-[100px] p-4 rounded-2xl border snap-center cursor-pointer transition-colors ${v.selected ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"}`}
          >
            <v.icon
              className={`mb-2 ${v.selected ? "text-primary" : "text-white/50"}`}
            />
            <div className="font-bold">{v.name}</div>
            <div className="text-sm text-white/70">{v.price}</div>
            <div className="text-xs text-white/40 mt-1">{v.time}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sm">
          <CreditCard size={16} className="text-primary" />
          <span>Card ending in 4242</span>
        </div>
        <div className="text-2xl font-bold text-primary">$12.00</div>
      </div>
      <Button className="w-full" onClick={() => setScreen("searching")}>
        Confirm Ride
      </Button>
    </div>
  </MapBackground>
);

const SearchingDriver = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute inset-0 flex items-center justify-center z-10">
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
    <div className="absolute bottom-12 left-6 right-6 z-10 text-center">
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
    {/* Auto-transition for demo */}
    {setTimeout(() => setScreen("tracking"), 3000) && null}
  </MapBackground>
);

const RideTracking = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-[30%] left-[40%] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
      <Car className="text-black" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 glass-panel rounded-t-3xl p-6 z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="w-14 h-14 bg-gray-600 rounded-full overflow-hidden">
            <img
              src="https://picsum.photos/seed/driver/100/100"
              alt="Driver"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">Michael D.</h3>
            <div className="flex items-center gap-1 text-sm text-primary">
              <Star size={14} fill="currentColor" /> 4.9
            </div>
            <div className="text-sm text-white/50 mt-1">
              Toyota Prius • ABC 1234
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">3 min</div>
          <div className="text-sm text-white/50">away</div>
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="flex-1">
          <Phone size={18} /> Call
        </Button>
        <Button variant="outline" className="flex-1">
          <MessageSquare size={18} /> Chat
        </Button>
        <Button variant="danger" className="px-4">
          <AlertOctagon size={18} />
        </Button>
      </div>
      <Button className="w-full" onClick={() => setScreen("active")}>
        Simulate Pickup
      </Button>
    </div>
  </MapBackground>
);

const RideActive = ({ setScreen }: any) => (
  <MapBackground>
    <div className="absolute top-6 left-6 right-6 z-10">
      <GlassCard className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <div className="w-6 h-6 rounded-full bg-green-500 mx-auto mb-1 flex items-center justify-center">
              <CheckCircle size={12} className="text-black" />
            </div>
            <div className="text-[10px] text-white/50">Pickup</div>
          </div>
          <div className="h-px bg-primary flex-1" />
          <div className="text-center flex-1">
            <div className="w-6 h-6 rounded-full bg-primary mx-auto mb-1 flex items-center justify-center shadow-[0_0_10px_rgba(255,214,0,0.5)]">
              <Navigation size={12} className="text-black" />
            </div>
            <div className="text-[10px] text-primary">On Ride</div>
          </div>
          <div className="h-px bg-white/20 flex-1" />
          <div className="text-center flex-1">
            <div className="w-6 h-6 rounded-full bg-white/20 mx-auto mb-1" />
            <div className="text-[10px] text-white/50">Drop</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">12 min</div>
          <div className="text-sm text-white/50">to destination</div>
        </div>
      </GlassCard>
    </div>
    <div className="absolute bottom-6 left-6 right-6 z-10">
      <Button className="w-full" onClick={() => setScreen("completion")}>
        Simulate Drop-off
      </Button>
    </div>
  </MapBackground>
);

const RideCompletion = ({ setScreen }: any) => (
  <div className="p-6 flex flex-col h-full justify-center">
    <div className="text-center mb-8">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-bold mb-2">You've Arrived!</h1>
      <p className="text-white/50">Hope you enjoyed your ride.</p>
    </div>
    <GlassCard className="mb-8">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-primary mb-1">$12.00</div>
        <div className="text-sm text-white/50">
          Paid via Card ending in 4242
        </div>
      </div>
      <div className="h-px bg-white/10 w-full mb-6" />
      <h3 className="text-center font-bold mb-4">Rate your driver</h3>
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={32}
            className="text-primary cursor-pointer"
            fill={i <= 4 ? "currentColor" : "none"}
          />
        ))}
      </div>
      <textarea
        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none mb-4 resize-none"
        placeholder="Leave a compliment..."
        rows={3}
      />
      <Button className="w-full" onClick={() => setScreen("dashboard")}>
        Done
      </Button>
    </GlassCard>
  </div>
);

const RideHistory = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Ride History</h1>
    <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
      <button className="px-4 py-1.5 rounded-full bg-primary text-black text-sm font-medium whitespace-nowrap">
        All Rides
      </button>
      <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium whitespace-nowrap">
        Business
      </button>
      <button className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium whitespace-nowrap">
        Personal
      </button>
    </div>
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <GlassCard key={i}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm text-white/50">
              Oct {10 - i}, 2023 • 10:30 AM
            </div>
            <div className="font-bold">${(12 + i * 2.5).toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <div className="w-0.5 h-6 bg-white/20 my-1" />
              <div className="w-2 h-2 rounded-sm bg-red-500" />
            </div>
            <div className="flex-1">
              <div className="text-sm mb-4">123 Main St, City Center</div>
              <div className="text-sm">Airport Terminal 1</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const PassengerProfile = ({ setScreen }: any) => (
  <div className="p-6">
    <div className="text-center mb-8">
      <div className="w-24 h-24 bg-gray-600 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary">
        <img
          src="https://picsum.photos/seed/passenger/150/150"
          alt="Profile"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="text-2xl font-bold">Aathi</h1>
      <p className="text-white/50">aathi@example.com</p>
    </div>
    <GlassCard className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPinIcon className="text-primary" />
          <div>
            <div className="font-bold">Home</div>
            <div className="text-sm text-white/50">123 Main St, Apt 4B</div>
          </div>
        </div>
        <ChevronRight className="text-white/30" />
      </div>
      <div className="h-px bg-white/10 w-full mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="text-primary" />
          <div>
            <div className="font-bold">Work</div>
            <div className="text-sm text-white/50">Tech Park, Building C</div>
          </div>
        </div>
        <ChevronRight className="text-white/30" />
      </div>
    </GlassCard>
    <GlassCard className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="text-primary" />
          <div>
            <div className="font-bold">Payment Methods</div>
            <div className="text-sm text-white/50">Visa ending in 4242</div>
          </div>
        </div>
        <ChevronRight className="text-white/30" />
      </div>
    </GlassCard>
    <Button
      variant="danger"
      className="w-full"
      onClick={() => window.location.reload()}
    >
      Log Out
    </Button>
  </div>
);
