import { Card } from "@/components/Card"
import { PokemonSpec } from "@/components/pokemon/PokemonSpec"
import { PokemonStat } from "@/components/pokemon/PokemonStat"
import { PokemonType } from "@/components/pokemon/PokemonType"
import { RootView } from "@/components/RootView"
import { Row } from "@/components/Row"
import { ThemedText } from "@/components/ThemedText"
import { Colors } from "@/constants/Colors"
import { formatWeight, getPokemonArtwork } from "@/functions/pokemon"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import { useThemeColors } from "@/hooks/useThemeColors"
import { router, useLocalSearchParams } from "expo-router"
import { Image, Pressable, StyleSheet, View } from "react-native"

export default function Pokemon() {
  const colors = useThemeColors()
  const params = useLocalSearchParams() as { id: string }
  const { data: pokemon } = useFetchQuery("/pokemon/[id]", { id: params.id })
  const { data: species } = useFetchQuery("/pokemon-species/[id]", {
    id: params.id,
  })
  const mainType = pokemon?.types?.[0].type.name
  const colorType = mainType ? Colors.type[mainType] : colors.tint
  const types = pokemon?.types ?? []
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === "en")
    ?.flavor_text.replaceAll("\n", ". ")

  return (
    <RootView style={{ backgroundColor: colorType }}>
      <View>
        <Image
          style={styles.pokeball}
          source={require("@/assets/images/pokeball_big.png")}
          width={208}
          height={208}
        />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                source={require("@/assets/images/back.png")}
                width={32}
                height={32}
              />
              <ThemedText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: "capitalize" }}
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>

          <ThemedText color="grayWhite" variant="subtitle2">
            #{params.id.padStart(3, "0")}
          </ThemedText>
        </Row>
        <View style={styles.body}>
          <Image
            style={styles.artwork}
            source={{
              uri: getPokemonArtwork(params.id),
            }}
            width={200}
            height={200}
          />
          <Card style={styles.card}>
            <Row gap={16}>
              {types.map((type) => (
                <PokemonType name={type.type.name} key={type.type.name} />
              ))}
            </Row>

            {/* About */}
            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              About
            </ThemedText>
            <Row>
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatWeight(pokemon?.weight)}
                description="Weight"
                image={require("@/assets/images/poids.png")}
              />
              <PokemonSpec
                style={{
                  borderStyle: "solid",
                  borderRightWidth: 1,
                  borderColor: colors.grayLight,
                }}
                title={formatWeight(pokemon?.height)}
                description="Size"
                image={require("@/assets/images/taille.png")}
              />
              <PokemonSpec
                title={pokemon?.moves
                  .slice(0, 2)
                  .map((m) => m.move.name)
                  .join("\n")}
                description="Moves"
              />
            </Row>

            <ThemedText>{bio}</ThemedText>

            {/* Stats */}
            <ThemedText variant="subtitle1" style={{ color: colorType }}>
              Base Stats
            </ThemedText>

            <View style={{ alignSelf: "stretch" }}>
              {pokemon?.stats.map((stat) => (
                <PokemonStat
                  key={stat.stat.name}
                  name={stat.stat.name}
                  value={stat.base_stat}
                  color={colorType}
                />
              ))}
            </View>
          </Card>
        </View>
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: "space-between",
  },
  pokeball: {
    opacity: 1,
    position: "absolute",
    right: 8,
    top: 8,
  },
  artwork: {
    position: "absolute",
    top: -140,
    alignSelf: "center",
    zIndex: 2,
  },
  body: {
    marginTop: 144,
  },
  card: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    gap: 16,
    alignItems: "center",
  },
})
