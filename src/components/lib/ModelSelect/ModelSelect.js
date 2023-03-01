import React from "react";
import { styled, Autocomplete, Avatar, TextField, Stack, Box } from "@mui/material";
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

  const onValueChanged = async ({ value }) => {
    if (!value?.length) return;
    const opts = await getModelsByName(value);
    const vids = await findVideos(value);
    setOptions(
      [
        {
          name: `Create new model named "${value}"`,
          caption: vids?.records?.length ? `Found in ${vids.records.length} videos` : "",
          value,
          create: 1,
        },
      ].concat(opts)
    );
    // setOptions(opts);
    // console.log(opts)
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
    return <>
    <Stack {...props}>
      <Nowrap>{option.name}</Nowrap>
    {!!option.caption && <Nowrap variant="caption">{option.caption}</Nowrap>}
    </Stack>

    </>;
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
      setOptions(value ? [value] : []);
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

        setOptions(
          [
            {
              name: `Create new model named ${inputValue}`,
              create: 1,
            },
          ].concat(newOptions)
        );
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Layout data-testid="test-for-ModelSelect">
      <Autocomplete
        sx={{ minWidth: 300 }}
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
