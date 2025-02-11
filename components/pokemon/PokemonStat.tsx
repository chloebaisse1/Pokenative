import { Row } from "@/components/Row"
import { ThemedText } from "@/components/ThemedText"
import { useThemeColors } from "@/hooks/useThemeColors"
import { useEffect } from "react"
import { StyleSheet, View, ViewProps } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

type Props = ViewProps & {
  name: string
  value: number
  color: string
}

function StatShortName(name: string): string {
  return name
    .replaceAll("special", "S")
    .replaceAll("-", "")
    .replaceAll("attack", "ATK")
    .replaceAll("defense", "DEF")
    .replaceAll("speed", "SPD")
    .toUpperCase()
}

export function PokemonStat({ style, color, name, value, ...rest }: Props) {
  const colors = useThemeColors()
  const sharedValue = useSharedValue(value)

  const barInnerStyle = useAnimatedStyle(() => {
    return {
      flex: sharedValue.value,
    }
  })
  const barBackgroundtyle = useAnimatedStyle(() => {
    return {
      flex: 255 - sharedValue.value,
    }
  })

  useEffect(() => {
    sharedValue.value = withSpring(value)
  }, [value])

  return (
    <Row gap={8} style={[style, styles.root]} {...rest}>
      <View style={[styles.name, { borderColor: colors.grayLight }]}>
        <ThemedText variant="subtitle3" style={{ color: color }}>
          {StatShortName(name)}
        </ThemedText>
      </View>
      <View style={styles.number}>
        <ThemedText>{value.toString().padStart(3, "0")}</ThemedText>
      </View>
      <Row style={styles.bar}>
        <Animated.View
          style={[styles.barInner, { backgroundColor: color }, barInnerStyle]}
        />
        <Animated.View
          style={[
            styles.barBackground,
            barBackgroundtyle,
            { backgroundColor: color },
          ]}
        />
      </Row>
    </Row>
  )
}
const styles = StyleSheet.create({
  root: {},
  name: {
    width: 40,
    paddingRight: 8,
    borderRightWidth: 1,
    borderStyle: "solid",
  },
  number: {
    width: 23,
  },
  bar: {
    flex: 1,
    borderRadius: 20,
    height: 4,
    overflow: "hidden",
  },
  barInner: {
    height: 4,
  },
  barBackground: {
    opacity: 0.24,
  },
})
