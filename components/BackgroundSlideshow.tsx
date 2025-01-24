import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet } from "react-native";

import backgroundOne from "../assets/images/bg1.png";
import backgroundTwo from "../assets/images/bg2.png";
import backgroundThree from "../assets/images/bg3.png";

const BackgroundSlideshow = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const backgrounds = [backgroundOne, backgroundTwo, backgroundThree];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundIndex((prevIndex) =>
        prevIndex === backgrounds.length - 1 ? 0 : prevIndex + 1
      );
    }, 7000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={backgrounds[backgroundIndex]}
      resizeMode="cover"
      priority="high"
      cachePolicy="memory-disk"
    />
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BackgroundSlideshow;
