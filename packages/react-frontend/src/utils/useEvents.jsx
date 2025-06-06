// hooks/useEvents.js
// reusable function to fetch events from the backend
// allows all the month, week, and day views to use the same function
// and have the same data

import { useState, useEffect } from 'react';
import { API_URL } from "./utils/api";

export default function useEvents() {
  const [events, setEvents] = useState([]);
  // filter functions
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  // const [selectedDay, setSelectedDay] = useState(new Date());

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    const filtered = applyFilters(events, selectedFilters);
    setFilteredEvents(filtered);
  }, [events, selectedFilters]);




  
  // Function to apply current filters to events
  const applyFilters = (eventsToFilter, filters) => {
    // If no filters are selected, show ALL events (including those without flags)
    if (filters.length === 0) {
      return eventsToFilter;
    }
    
    // If filters are selected, only show events that have at least one matching flag
    return eventsToFilter.filter(event => {
      // If event has no flags, don't show it when filters are active
      if (!event.flags || !Array.isArray(event.flags) || event.flags.length === 0) {
        return false;
      }
      
      // Check if event has at least one of the selected flags
      return event.flags.some(flag => filters.includes(flag));
    });
  };

  // Handle filter changes from sidebar
  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    const filtered = applyFilters(events, filters);
    setFilteredEvents(filtered);
  };



  return { events, fetchEvents, handleFilterChange, filteredEvents};
}