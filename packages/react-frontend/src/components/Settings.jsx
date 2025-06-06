import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { API_URL } from "../config";
import "../styles/Settings.css";

const Settings = ({ setDisplayName }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: false,
    emailUpdates: false,
    weekStartsOn: "sunday",
    timeFormat: "12",
    defaultView: "week",
    font: "inter",
    displayName: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("calendarSettings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings((prev) => ({
        ...prev,
        ...parsedSettings,
        theme: undefined, // Don't override theme from context
      }));
      if (setDisplayName && parsedSettings.displayName) {
        setDisplayName(parsedSettings.displayName);
        localStorage.setItem("name", parsedSettings.displayName);
      }
    }
    applyFont(settings.font);
  }, []);

  // Apply font whenever settings.font changes
  useEffect(() => {
    applyFont(settings.font);
  }, [settings.font]);

  const handleBackClick = () => {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
    ) {
      return;
    }
    navigate(-1);
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setIsDirty(true);

    if (name === "theme") {
      toggleTheme(value);
    }
    if (name === "font") {
      applyFont(value);
    }
    if (name === "displayName" && setDisplayName) {
      setDisplayName(value);
      localStorage.setItem("name", value);
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    const settingsToSave = {
      ...settings,
      theme, // Include current theme from context
    };
    localStorage.setItem("calendarSettings", JSON.stringify(settingsToSave));
    localStorage.setItem("name", settings.displayName);
    applyFont(settings.font);
    setIsDirty(false);
    alert("Settings saved successfully!");
    navigate("/month");
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      if (response.ok) {
        alert("Password changed successfully!");
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert("Error changing password!");
      }
    } catch (error) {
      alert("Error changing password!");
    }
  };

  const exportToICS = () => {
    const icsContent =
      "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MyCalendar//EN\nEND:VCALENDAR";
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendar.ics";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  async function deleteAccount() {
    const email = localStorage.getItem("email");
    try {
      const response = await fetch(`${API_URL}/auth/settings`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: email }),
      });

      if (response.status === 204) {
        alert("Account successfully deleted.");
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        navigate("/register");
      } else {
        alert("Error deleting account!");
      }
    } catch (error) {
      alert("Error deleting account!");
    }
  }

  const applyFont = (font) => {
    document.documentElement.style.setProperty("--font-family", font);
  };

  const resetToDefaults = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      const defaults = {
        notifications: false,
        emailUpdates: false,
        weekStartsOn: "sunday",
        timeFormat: "12",
        defaultView: "week",
        font: "inter",
        displayName: "",
      };
      setSettings(defaults);
      toggleTheme("light");
      applyFont(defaults.font);
      localStorage.setItem("name", "");
      if (setDisplayName) setDisplayName("");
      setIsDirty(true);
    }
  };

  return (
    <div className="settings-page" style={{ fontFamily: settings.font }}>
      <div className="settings-header">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        <h1>Settings</h1>
        {isDirty && <span className="unsaved-changes">Unsaved Changes</span>}
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Profile</h2>
          <div className="setting-option">
            <label htmlFor="displayName">Display Name:</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={settings.displayName}
              onChange={handleSettingChange}
              placeholder="Enter your display name"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-option">
            <label htmlFor="theme">Theme:</label>
            <select
              id="theme"
              name="theme"
              value={theme}
              onChange={handleSettingChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </div>
          <div className="setting-option">
            <label htmlFor="font">Font:</label>
            <select
              id="font"
              name="font"
              value={settings.font}
              onChange={handleSettingChange}
            >
              <option value="inter">Inter</option>
              <option value="roboto">Roboto</option>
              <option value="open-sans">Open Sans</option>
              <option value="lora">Lora</option>
            </select>
          </div>
          <div className="setting-option">
            <label htmlFor="defaultView">Default View:</label>
            <select
              id="defaultView"
              name="defaultView"
              value={settings.defaultView}
              onChange={handleSettingChange}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleSettingChange}
              />
              Text Updates
            </label>
          </div>
          <div className="setting-option">
            <label>
              <input
                type="checkbox"
                name="emailUpdates"
                checked={settings.emailUpdates}
                onChange={handleSettingChange}
              />
              Email Updates
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Date & Time</h2>
          <div className="setting-option">
            <label htmlFor="weekStartsOn">Week Starts On:</label>
            <select
              id="weekStartsOn"
              name="weekStartsOn"
              value={settings.weekStartsOn}
              onChange={handleSettingChange}
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </select>
          </div>
          <div className="setting-option">
            <label htmlFor="timeFormat">Time Format:</label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={settings.timeFormat}
              onChange={handleSettingChange}
            >
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Account</h2>
          <div className="setting-option">
            <button
              className="account-button"
              onClick={() => setShowPasswordChange(true)}
            >
              Change Password
            </button>
            <button className="account-button" onClick={exportToICS}>
              Export Calendar
            </button>
          </div>
          {showPasswordChange && (
            <div className="password-change-form">
              <h3>Change Password</h3>
              <div className="setting-option">
                <label htmlFor="currentPassword">Current Password:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChangeInput}
                />
              </div>
              <div className="setting-option">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChangeInput}
                />
              </div>
              <div className="setting-option">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChangeInput}
                />
              </div>
              <div className="setting-option">
                <button
                  className="account-button"
                  onClick={handlePasswordChange}
                >
                  Save Password
                </button>
                <button
                  className="account-button"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <div className="setting-option">
            {!showDeleteConfirm ? (
              <button
                className="account-button danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className="delete-confirm">
                <span>Are you sure you want to delete your account?</span>
                <button
                  className="account-button danger"
                  onClick={deleteAccount}
                >
                  Confirm Delete
                </button>
                <button
                  className="account-button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="settings-actions">
          <button className="reset-button" onClick={resetToDefaults}>
            Reset to Defaults
          </button>
          <button
            className="save-button"
            onClick={handleSaveSettings}
            disabled={!isDirty}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
