import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useDeviceType() {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const effectiveHeight = Math.max(0, height - (insets.top + insets.bottom));

  // Basic tablet breakpoint — keep centralized so it can be adjusted app-wide.
  const isTablet = width >= 1024 && effectiveHeight <= 1366;

  return {
    width,
    height,
    scale,
    fontScale,
    insets,
    effectiveHeight,
    isTablet,
  } as const;
}

export default useDeviceType;
