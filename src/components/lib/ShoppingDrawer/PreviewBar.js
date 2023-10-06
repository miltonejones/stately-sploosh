import {
  Stack,
  Snackbar,
  Typography,
  Box,
  IconButton,
  Alert,
  Button,
  Link,
  Popover,
  LinearProgress,
} from "@mui/material";
import { Flex } from "../../../styled";

export default function PreviewBar({ viewer }) {
  const { video, open, URL } = viewer;

  return (
    <Popover
      anchorEl={viewer.anchorEl}
      onClose={viewer.handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      open={open}
    >
      <Box sx={{ p: 2, backgroundColor: "white", maxWidth: 500 }}>
        {" "}
        {!video && (
          <>
            <Alert>Loading "{URL}"...</Alert>
            <LinearProgress />
          </>
        )}
        {!!video && (
          <>
            <Flex>
              <Typography
                sx={{
                  maxWidth: 460,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {video.title}
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => viewer.handleClose()}>
                &times;
              </IconButton>
            </Flex>
            <Stack direction="column">
              <Box>
                <iframe
                  style={{ border: "none" }}
                  src={video.src}
                  width="480"
                  height="270"
                  border="0"
                />
              </Box>
            </Stack>
            {!!video?.domain && (
              <Link href={URL} target="_blank" rel="noreferrer">
                Open on {video.domain}
              </Link>
            )}
          </>
        )}
      </Box>
    </Popover>
  );
}
