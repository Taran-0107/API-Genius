// components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { House, Compass, Code, Users, Key, ChartBar, User, SignIn } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/AuthContext"; 
import { text } from "stream/consumers";

const navItems = [
  { label: "Home", path: "/", icon: House },
  { label: "Discovery", path: "/discovery", icon: Compass },
  { label: "Integration", path: "/integration", icon: Code },
  { label: "Community", path: "/community", icon: Users },
  { label: "Keys", path: "/keys", icon: Key },
  { label: "Compare", path: "/comparison", icon: ChartBar },
];

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn,logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-gradient">API Genius</div>
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            {navItems.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Auth Buttons */}
          {!isLoggedIn ? (
          <div className="flex items-center space-x-3">
            <Link 
              to="/login" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              <SignIn size={20} />
              <span>Sign In</span>
            </Link>
            <Button 
              asChild
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
          ) : (
          <div className="flex items-center space-x-3">
            <Link 
              to="/profile"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              <User size={20} /> 
              <span>Profile</span>
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white" 
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              
            >
              <button type="button">Logout</button>
            </Button>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
