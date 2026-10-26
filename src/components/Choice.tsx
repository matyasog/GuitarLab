import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radii, space } from '@/theme';

import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

// Selectable options for "pick one" questions (onboarding). Selected = amber border and
// tint, as in the design. Screen readers hear them as radio buttons.

type ChoiceRowProps = {
  title: string;
  subtitle: string;
  icon: IconName;
  selected: boolean;
  onSelect: () => void;
};

// Row option with an icon, from "Option / …" on "Onboarding / level".
export function ChoiceRow({ title, subtitle, icon, selected, onSelect }: ChoiceRowProps) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityLabel={`${title}, ${subtitle}`}
      accessibilityState={{ checked: selected, selected }}
      style={[styles.option, styles.row, selected && styles.selected]}
    >
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Icon name={icon} color={selected ? 'amber' : 'text2'} />
      </View>
      <View style={styles.text}>
        <AppText variant="label16">{title}</AppText>
        <AppText variant="helper14" color="muted">
          {subtitle}
        </AppText>
      </View>
      <Icon name={selected ? 'circle-dot' : 'circle'} color={selected ? 'amber' : 'subtle'} />
    </Pressable>
  );
}

type ChoiceCardProps = {
  title: string;
  image: ImageSource;
  selected: boolean;
  onSelect: () => void;
};

// Card option with a photo, from "Option / Acoustic · Electric" on "Onboarding / guitar".
export function ChoiceCard({ title, image, selected, onSelect }: ChoiceCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ checked: selected, selected }}
      style={[styles.option, styles.card, selected && styles.selected]}
    >
      <Image source={image} contentFit="cover" style={styles.image} accessible={false} />
      <View style={styles.labelRow}>
        <AppText variant="heading16">{title}</AppText>
        <Icon name={selected ? 'circle-dot' : 'circle'} color={selected ? 'amber' : 'subtle'} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.amber,
    backgroundColor: colors.amberSoft,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
    paddingVertical: space[12],
    paddingHorizontal: space[16],
    borderRadius: radii.control,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: radii.chip,
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: colors.amberWash,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  card: {
    flex: 1,
    gap: space[12],
    padding: space[16],
    borderRadius: radii.card,
  },
  image: {
    height: 120,
    borderRadius: radii.chip,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
