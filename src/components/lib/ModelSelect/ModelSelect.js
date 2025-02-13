import React from "react";
import {
  styled,
  Autocomplete,
  Avatar,
  TextField,
  Stack,
  Box,
} from "@mui/material";
import throttle from "lodash/throttle";
import { Nowrap } from "../../../styled";
import { findVideos, getModelsByName } from "../../../connector";

const Layout = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0),
}));

const ModelSelect = (props) => {
  const { onValueSelected } = props;

  // const onSelected = async (option)  => {
  //   if (option.value) {
  //     const { insertId } = await addModel(option.value);
  //     onValueSelected && onValueSelected({
  //       name: option.value,
  //       ID:  insertId
  //     });
  //     return;
  //   }
  //   onValueSelected && onValueSelected(option)
  // }
  function getFullNames(str) {
    // Split into words
    const words = str.trim().split(/\s+/);

    // Array to store full names
    const fullNames = [];

    // Process pairs of words
    for (let i = 0; i < words.length; i += 2) {
      // Check if we have both first and last name
      if (i + 1 < words.length) {
        fullNames.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return fullNames;
  }

  const onValueChanged = async ({ value }) => {
    if (!value?.length) return;
    let message = `Create new star named "${value}"`;
    const names = getFullNames(value);

    if (names.length > 1) {
      message = `Add "${names.length}" models to the video`;
      console.log({ message });

      setOptions([
        {
          name: message,
          value,
          create: 1,
        },
      ]);
      return;
    }

    if (value.indexOf(",") > 0) {
      const stars = value.split(",");
      message = `Add "${stars.length}" models to the video`;
      console.log({ message });

      setOptions([
        {
          name: message,
          value,
          create: 1,
        },
      ]);
      return;
    }

    const opts = await getModelsByName(value);
    const vids = await findVideos(value);
    let caption = vids?.records?.length
      ? `Found in ${vids.records.length} videos`
      : "";

    console.log({ message });

    setOptions(
      [
        {
          name: message,
          caption,
          value,
          create: 1,
        },
      ].concat(opts)
    );
  };
  const [value] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const renderOption = (props, option) => {
    if (option.image)
      return (
        <Box {...props}>
          <Avatar sx={{ mr: 1 }} src={option.image} alt={option.name} />
          {option.name}
        </Box>
      );
    return (
      <>
        <Stack {...props}>
          <Nowrap>{option.name}</Nowrap>
          {!!option.caption && (
            <Nowrap variant="caption">{option.caption}</Nowrap>
          )}
        </Stack>
      </>
    );
  };

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        onValueChanged && onValueChanged(request);
      }, 1000),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      // setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ value: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        // setOptions(
        //   [
        //     {
        //       name: `Create new model named ${inputValue}!`,
        //       create: 1,
        //     },
        //   ].concat(newOptions)
        // );
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Layout data-testid="test-for-ModelSelect">
      <Autocomplete
        sx={{ minWidth: "100%" }}
        renderOption={renderOption}
        getOptionLabel={(option) => option.name || option}
        options={options}
        value={props.value}
        onChange={(event, newValue) => {
          onValueSelected && onValueSelected(newValue);
          // setValue(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            label="Choose model"
            placeholder="Type a model name"
            {...params}
            size={"small"}
          />
        )}
      />
    </Layout>
  );
};
ModelSelect.defaultProps = {};
export default ModelSelect;
