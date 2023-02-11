import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

export default function TopBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h5">Maintenance Manager</Typography>
      </Toolbar>
    </AppBar>
  );
}
