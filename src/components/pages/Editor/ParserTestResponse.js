import {
  Box,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { Flex } from "../../../styled";
import { VideoCard } from "../../lib";

export default function ParserTestResponse({ editor, parser, viewer }) {
  if (!editor.state.matches("opened")) return <i />;
  return (
    <>
      {/* {!!editor.result?.length && (
        <Card sx={{ maxWidth: 368, mb: 2, p: 2 }}>
          <legend>Parser response</legend>{" "}
          <Stack spacing={1}>
            {parser.pageMatrix.fields.L.map((field, i) => (
              <TextField
                size="small"
                key={field.S}
                label={field.S}
                value={editor.result[i + 1]}
              />
            ))}
          </Stack>
        </Card>
      )} */}

      {!!editor.specimens && (
        <Box
          sx={{
            gap: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ",
          }}
        >
          {editor.specimens.map((spec) => (
            <PhotoCard
              key={spec.URL}
              viewer={viewer}
              {...spec}
              domain={editor.parser}
            />
          ))}
        </Box>
      )}

      {!!editor.pages?.length && (
        <Card sx={{ maxWidth: 368, mt: 2, p: 2 }}>
          <Typography variant="subtitle2">Pages</Typography>
          <Flex>
            {editor.pages.map((page) => {
              const [name, num] = page;
              return <IconButton size="small">{num}</IconButton>;
            })}
          </Flex>
        </Card>
      )}

      {!!editor.embedResult && <VideoCard video={editor.embedResult} />}
      <pre>{JSON.stringify(editor.embedResult, 0, 2)}</pre>
      {/* {JSON.stringify(editor.specimens, 0, 2)} */}
    </>
  );
}
