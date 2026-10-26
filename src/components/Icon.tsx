import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import AudioLines from 'lucide-react-native/icons/audio-lines';
import AudioWaveform from 'lucide-react-native/icons/audio-waveform';
import Award from 'lucide-react-native/icons/award';
import BookOpen from 'lucide-react-native/icons/book-open';
import ChartNoAxesColumnIncreasing from 'lucide-react-native/icons/chart-no-axes-column-increasing';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import ChevronUp from 'lucide-react-native/icons/chevron-up';
import Circle from 'lucide-react-native/icons/circle';
import CircleAlert from 'lucide-react-native/icons/circle-alert';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import CircleDot from 'lucide-react-native/icons/circle-dot';
import Drum from 'lucide-react-native/icons/drum';
import EighthNotes from 'lucide-react-native/icons/eighth-notes';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import Flame from 'lucide-react-native/icons/flame';
import Grid3x3 from 'lucide-react-native/icons/grid-3x3';
import Guitar from 'lucide-react-native/icons/guitar';
import Hand from 'lucide-react-native/icons/hand';
import Library from 'lucide-react-native/icons/library';
import Lock from 'lucide-react-native/icons/lock';
import Mic from 'lucide-react-native/icons/mic';
import Minus from 'lucide-react-native/icons/minus';
import Pause from 'lucide-react-native/icons/pause';
import Play from 'lucide-react-native/icons/play';
import Plus from 'lucide-react-native/icons/plus';
import RotateCcwSquare from 'lucide-react-native/icons/rotate-ccw-square';
import RotateCw from 'lucide-react-native/icons/rotate-cw';
import SignalHigh from 'lucide-react-native/icons/signal-high';
import SignalLow from 'lucide-react-native/icons/signal-low';
import SignalMedium from 'lucide-react-native/icons/signal-medium';
import SlidersHorizontal from 'lucide-react-native/icons/sliders-horizontal';
import Sparkles from 'lucide-react-native/icons/sparkles';
import Speaker from 'lucide-react-native/icons/speaker';
import Square from 'lucide-react-native/icons/square';
import Target from 'lucide-react-native/icons/target';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import Type from 'lucide-react-native/icons/type';
import User from 'lucide-react-native/icons/user';
import WifiOff from 'lucide-react-native/icons/wifi-off';
import X from 'lucide-react-native/icons/x';

import { colors, type ColorName } from '@/theme';

// The Lucide icons used in design/guitarlab.pen, under the same names as in the design.
// Each icon is imported on its own, so only these end up in the app.
// ("music" is called "eighth-notes" in the current Lucide version; same drawing.)
const icons = {
  'arrow-left': ArrowLeft,
  'audio-lines': AudioLines,
  'audio-waveform': AudioWaveform,
  award: Award,
  'book-open': BookOpen,
  'chart-no-axes-column-increasing': ChartNoAxesColumnIncreasing,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  circle: Circle,
  'circle-alert': CircleAlert,
  'circle-check': CircleCheck,
  'circle-dot': CircleDot,
  drum: Drum,
  eye: Eye,
  'eye-off': EyeOff,
  flame: Flame,
  'grid-3x3': Grid3x3,
  guitar: Guitar,
  hand: Hand,
  library: Library,
  lock: Lock,
  mic: Mic,
  minus: Minus,
  music: EighthNotes,
  pause: Pause,
  play: Play,
  plus: Plus,
  'rotate-ccw-square': RotateCcwSquare,
  'rotate-cw': RotateCw,
  'signal-high': SignalHigh,
  'signal-low': SignalLow,
  'signal-medium': SignalMedium,
  'sliders-horizontal': SlidersHorizontal,
  sparkles: Sparkles,
  speaker: Speaker,
  square: Square,
  target: Target,
  'triangle-alert': TriangleAlert,
  type: Type,
  user: User,
  'wifi-off': WifiOff,
  x: X,
};

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  // The design uses 20 for buttons and 16 inside helper/error lines.
  size?: number;
  color?: ColorName;
};

// Icons are decoration: the control around them carries the accessibility label.
export function Icon({ name, size = 20, color = 'text' }: IconProps) {
  const LucideIcon = icons[name];
  return (
    <LucideIcon
      size={size}
      color={colors[color]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
