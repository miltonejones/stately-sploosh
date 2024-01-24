import { styled, Card } from "@mui/material";

const InBox = styled(Card)(({ open }) => ({
  width: 300,
  opacity: open ? 1 : 0,
  height: `calc(100vh - 170px)`,
  overflow: "auto",
}));

export default InBox;
