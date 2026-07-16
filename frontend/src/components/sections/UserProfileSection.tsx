// components/UserProfileSection.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Key, Gear, ChartBar } from "phosphor-react";
import { useAuth } from "@/AuthContext"; // Import the custom hook


gsap.registerPlugin(ScrollTrigger);

const mockUser = {
  apiKeys: 3,
  usage: "1.2M tokens this month",
  preferences: {
    theme: "Dark",
    notifications: true,
  },
};

const UserProfileSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser): null; // Fallback to "Guest" if no user
  

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-gradient mb-4">Your Profile</h2>
          <p className="text-lg text-muted-foreground">Manage your account, preferences, and API usage</p>
        </div>

        {/* Glass profile card */}
        <div className="glass-card p-8 space-y-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <User size={32} className="text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{user.username}</h3>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>

          {/* API Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Key size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active API Keys</p>
                <p className="text-lg font-medium">{mockUser.apiKeys}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ChartBar size={20} className="text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Usage</p>
                <p className="text-lg font-medium">{mockUser.usage}</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex items-center space-x-3">
            <Gear size={20} className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Theme Preference</p>
              <p className="text-lg font-medium">{mockUser.preferences.theme}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button className="btn-neon flex-1 text-sm py-2">Manage API Keys</button>
            <button className="btn-glass flex-1 text-sm py-2">Edit Preferences</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
