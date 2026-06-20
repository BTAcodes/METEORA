import type { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}

  // get the user Location

export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });

  const getLocation = () => {
    setLocationData((prev) => ({ ...prev, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "geolocation is not supported by your browser",
        isLoading: false,
      });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "location permission denid. please enable location accses.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "location information is unavaliable";
            break;
          case error.TIMEOUT:
            errorMessage = "location requset timed out";
            break;
          default:
            errorMessage = "an unkown errro";
        }
        setLocationData({
            coordinates: null,
            error: errorMessage,
            isLoading: false
        })
      },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
  useEffect(() => {
    getLocation();
  }, []);
  return {
    ...locationData,
    getLocation,
  };
}
