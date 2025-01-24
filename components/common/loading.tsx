import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { containerStyles } from "../../styles/general";

export const Loading = ({ loadingText, isLoading }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const ball1 = useRef(new Animated.Value(0)).current;
  const ball2 = useRef(new Animated.Value(0)).current;
  const ball3 = useRef(new Animated.Value(0)).current;

  const [showTimedText, setShowTimedText] = useState<boolean>(false);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ball1, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ball1, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(ball2, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ball2, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(ball3, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ball3, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  //fade out effect
  // useEffect(() => {
  //   if (isLoading) {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // }, [isLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTimedText(true);
    }, 20000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.ballContainer}>
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [
                {
                  translateY: ball1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [
                {
                  translateY: ball2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [
                {
                  translateY: ball3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <Text style={styles.loadingText}>{loadingText}</Text>
      {showTimedText && (
        <Text style={styles.delayedText}>
          This is taking longer than expected. We apologize for the delay
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...containerStyles.centeredContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  ballContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  ball: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    marginHorizontal: 5,
  },
  loadingText: {
    fontSize: 13,
    fontFamily: "Poppins",
  },
  delayedText: {
    width: 250,
    marginTop: 20,
    textAlign: "center",
  },
});
