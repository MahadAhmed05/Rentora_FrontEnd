import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";
import { typography } from "./typography";
import { components } from "./components";
import { breakpoints } from "./breakpoints";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    background: { default: colors.background.default, paper: colors.background.paper },
    text: { primary: colors.text.primary, secondary: colors.text.secondary },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    divider: colors.divider,
  },
  typography,
  shape: { borderRadius: 12 },
  components,
  breakpoints,
});
