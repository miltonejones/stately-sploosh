import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMachine } from "@xstate/react";
import { editorMachine } from "../../../machines/editorMachine";
import { getParsers } from "../../../connector/parser";
import { EditForm } from "./EditForm";
import { PhotoCard } from "../../lib/ShoppingDrawer/Cards";
import { usePreview } from "../../../services/usePreviewMachine";
import PreviewBar from "../../lib/ShoppingDrawer/PreviewBar";
import ParserTestResponse from "./ParserTestResponse";
import { AppStateContext } from "../../../context";
import { useWindowManager } from "../../../services";
import { Flex, Spacer } from "../../../styled";
import { saveParser } from "../../../connector";
import { restoreObjectLabels } from "../../../util/restoreObjectLabels";

export default function Editor() {
  const WindowManager = useWindowManager();
  const editor = useEditor();
  const viewer = usePreview();
  if (!editor.parsers) {
    return <>Loading...</>;
  }
  const { parser, specimenText } = editor;
  const selectedParser = editor.parsers.find((p) => p.domain === parser);
  let result = null;
  if (selectedParser?.pageParser && editor.specimenText) {
    result = new RegExp(selectedParser.pageParser, "g").exec(
      editor.specimenText
    );
  }

  const showCreate = editor.state.matches("get new parser name");
  return (
    <AppStateContext.Provider value={{ WindowManager }}>
      <Flex spacing={1}>
        <Button variant="contained" sx={{ m: 1 }} href="/video/1">
          back to Library
        </Button>
        {editor.state.can("create") && (
          <Button sx={{ m: 1 }} onClick={() => editor.send("create")}>
            Create Parser
          </Button>
        )}
        {editor.state.can("recover") && (
          <>
            An error occurred!!
            <Button sx={{ m: 1 }} onClick={() => editor.send("recover")}>
              recover
            </Button>
          </>
        )}
      </Flex>
      <PreviewBar viewer={viewer} />
      {/* {JSON.stringify(editor.state.value)} */}
      <Grid container>
        <Grid item xs={4}>
          {showCreate && (
            <>
              <Stack spacing={1} sx={{ p: 2 }}>
                <Typography>Create new parser named:</Typography>
                <TextField
                  size="small"
                  name="parserName"
                  value={editor.parserName}
                  onChange={editor.handleChange}
                  label="New Parser Name"
                />
                <Flex spacing={1}>
                  <Spacer />
                  <Button onClick={() => editor.send("cancel")}>cancel</Button>
                  <Button
                    variant="contained"
                    onClick={() => editor.send("save")}
                  >
                    save
                  </Button>
                </Flex>
              </Stack>
            </>
          )}

          {!showCreate && (
            <Box sx={{ width: "calc(33vw - 40px)", overflow: "auto", p: 2 }}>
              <EditForm
                parser={selectedParser}
                editor={editor}
                result={result}
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={8}>
          <ParserTestResponse
            editor={editor}
            parser={selectedParser}
            viewer={viewer}
          />

          {/* <pre>{JSON.stringify(editor.embedResult, 0, 2)}</pre> */}
          {/* {!!editor.result?.length && (
            <Card sx={{ maxWidth: 400, mb: 2, p: 2 }}>
              <legend>Parser response</legend>{" "}
              <Stack spacing={1}>
                {selectedParser.pageMatrix.fields.L.map((field, i) => (
                  <TextField
                    size="small"
                    key={field.S}
                    label={field.S}
                    value={editor.result[i + 1]}
                  />
                ))}
              </Stack>
            </Card>
          )}

          {!!editor.specimen && (
            <PhotoCard size={360} viewer={viewer} {...editor.specimen} />
          )} */}
        </Grid>
      </Grid>
      {/* {editor.parsers
        .filter((f) => !!f.pageParser)
        .map((p) => (
          <li
            key={p.domain}
            style={{ cursor: "pointer" }}
            onClick={() => editor.setState("parser", p.domain)}
          >
            {p.domain}
          </li>
        ))} */}
      {/* <Drawer
        anchor="left"
        onClose={() => editor.setState("parser", null)}
        open={!!parser}
      >
        <Box sx={{ width: 400, overflow: "auto", p: 2 }}>
          {!!selectedParser && (
            <EditForm parser={selectedParser} editor={editor} result={result} /> 
          )} 
        </Box>
      </Drawer> */}
      {/* <pre>
        {JSON.stringify(
          editor.parsers.map((p) => p.domain),
          0,
          2
        )}
      </pre> */}
    </AppStateContext.Provider>
  );
}

function useEditor() {
  const [state, send] = useMachine(editorMachine, {
    services: {
      updateParser: async (context) => {
        const selectedParser = context.parsers.find(
          (p) => p.domain === context.parser
        );
        if (!selectedParser) return;
        return await saveParser(restoreObjectLabels(selectedParser));
      },
      generateParser: async (context) => {
        const { parserName } = context;
        const selectedParser = context.parsers.find((p) => !!p.pageParser);
        if (!selectedParser) return;
        const updatedParser = restoreObjectLabels({
          ...selectedParser,
          domain: parserName,
        });
        console.log({ updatedParser });
        return await saveParser(updatedParser);
      },
      loadParsers: async () => {
        return await getParsers();
      },
    },
  });

  const setState = (name, value) => {
    send({
      type: "change",
      name,
      value,
    });
  };

  const setParser = (name, value) => {
    send({
      type: "update",
      name,
      value,
    });
  };

  const handleChange = (event) => {
    setState(event.target.name, event.target.value);
  };

  const handleUpdate = (event) => {
    setParser(event.target.name, event.target.value);
  };

  const handleEmbed = (event) => {
    send({
      type: "embed",
      name: event.target.name,
      value: event.target.value,
    });
  };

  const handleRegex = (event) => {
    send({
      type: "regex",
      name: event.target.name,
      value: event.target.value,
    });
  };

  return {
    state,
    diagnosticProps: {
      id: editorMachine.id,
      states: editorMachine.states,
      state,
    },
    send,
    handleChange,
    setState,
    setParser,
    handleUpdate,
    handleEmbed,
    handleRegex,
    ...state.context,
  };
}
