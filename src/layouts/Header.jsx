import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Topbar from "../global/Topbar";
import { tokens } from "../theme";

const Header = ({ toggleSidebar, isMobile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <AppBar position="static">
      <Toolbar sx={{ backgroundColor: colors.primary[400] }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Topbar />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
