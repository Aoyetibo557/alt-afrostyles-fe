import React, { useState, useEffect } from "react";
import { View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "../../styles/colors";

interface CustomImageProps {
  source: string;
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center";
  borderRadius?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: React.ReactNode;
}

export const CustomImage: React.FC<CustomImageProps> = ({
  source,
  width = "100%",
  height = 200,
  style,
  resizeMode = "cover",
  borderRadius = 0,
  onLoad,
  onError,
  placeholder,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  useEffect(() => {
    let animationCanceled = false;

    if (isLoading && !hasError) {
      progress.value = withRepeat(
        withTiming(-300, { duration: 1000, easing: Easing.ease }),
        -1,
        false
      );
    }

    return () => {
      animationCanceled = true;
      cancelAnimation(progress);
    };
  }, [isLoading, hasError]);

  const handleLoad = () => {
    setIsLoading(false);
    cancelAnimation(progress);
    onLoad && onLoad();
  };

  const handleError = (error: Error) => {
    setIsLoading(false);
    setHasError(true);
    cancelAnimation(progress);
    onError && onError(error);
  };

  const containerStyle: ViewStyle = {
    width,
    height,
    borderRadius,
    overflow: "hidden",
    ...StyleSheet.flatten(style),
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View style={containerStyle}>
      {isLoading && !hasError && (
        <View style={[styles.skeleton, { borderRadius }]}>
          <Animated.View style={[styles.skeletonAnimation, animatedStyle]}>
            <LinearGradient
              colors={[
                "transparent",
                "rgba(255, 255, 255, 0.3)",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      )}
      {hasError && placeholder}
      <ExpoImage
        style={[
          StyleSheet.absoluteFill,
          styles.image,
          { opacity: isLoading || hasError ? 0 : 1 },
        ]}
        width={width}
        height={height}
        source={source}
        priority="high"
        cachePolicy="memory"
        contentFit={resizeMode}
        transition={300}
        placeholder={{ blurhash }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  skeletonAnimation: {
    width: "100%",
    height: "100%",
  },
});
