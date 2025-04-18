import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, Moon, Sun } from 'lucide-react';
import { useUserStore } from '../store/user-store';
import { useThemeStore } from '../store/theme-store';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useUserStore();
  const { theme, setTheme } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  
  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    newMessages: true,
    roomInvites: true,
    friendActivity: false,
    emailNotifications: true,
  });
  
  const handleSaveProfile = () => {
    if (currentUser) {
      updateUser({
        username,
        email,
      });
      // Show success message or notification
    }
  };
  
  const handleNotificationChange = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };
  
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Not logged in</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Please log in to view settings.</p>
        <Button onClick={() => navigate('/login')}>Log in</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${
                  activeTab === 'profile' ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                <User size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-800 dark:text-white">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('payment')}
                className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${
                  activeTab === 'payment' ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                <CreditCard size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-800 dark:text-white">Payment Methods</span>
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${
                  activeTab === 'notifications' ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                <Bell size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-800 dark:text-white">Notifications</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${
                  activeTab === 'security' ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                <Shield size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="font-medium text-gray-800 dark:text-white">Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors ${
                  activeTab === 'appearance' ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                }`}
              >
                {theme === 'light' ? (
                  <Sun size={20} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Moon size={20} className="text-gray-700 dark:text-gray-300" />
                )}
                <span className="font-medium text-gray-800 dark:text-white">Appearance</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-dark-100 rounded-xl shadow-md p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <Button variant="outline" size="sm">
                        Change Image
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Payment Methods</h2>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <CreditCard size={24} className="text-gray-700 dark:text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-medium rounded-full">
                        Default
                      </span>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" leftIcon={<CreditCard size={16} />}>
                  Add Payment Method
                </Button>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {key === 'newMessages' && 'New Messages'}
                          {key === 'roomInvites' && 'Room Invites'}
                          {key === 'friendActivity' && 'Friend Activity'}
                          {key === 'emailNotifications' && 'Email Notifications'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {key === 'newMessages' && 'Get notified when you receive new messages in a room'}
                          {key === 'roomInvites' && 'Get notified when someone invites you to a watch party'}
                          {key === 'friendActivity' && 'Get notified about your friends\' activity'}
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleNotificationChange(key as keyof typeof notificationSettings)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input w-full"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Appearance */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                          theme === 'light'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                        }`}
                      >
                        <Sun size={32} className="text-orange-500" />
                        <span className="font-medium text-gray-800 dark:text-white">Light Mode</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 ${
                          theme === 'dark'
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-200'
                        }`}
                      >
                        <Moon size={32} className="text-indigo-500" />
                        <span className="font-medium text-gray-800 dark:text-white">Dark Mode</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};