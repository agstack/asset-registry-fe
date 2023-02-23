import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface IProps {
  setIsLoading: (e: any) => void;
  setCenter: (e: any) => void;
}

const LocationMarker = (props: IProps) => {
  const map = useMap();

  useEffect(() => {
    props.setIsLoading(true);
    map.locate().on("locationfound", function (e: any) {
      props.setCenter([e.latlng.lat, e.latlng.lng]);
      props.setIsLoading(false);
    });
  }, [map]);

  return <></>;
};

export default LocationMarker;
