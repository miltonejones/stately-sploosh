import { Menu, MenuItem, Stack, Tooltip, Typography } from "@mui/material";
import { useMenu } from "../../../machines";
import { StarAvatar } from "../ModelMemory/StarAvatar";

export default function ModelList({ modelClicked, model, models }) {
  const menu = useMenu(modelClicked);
  const moreText =
    models?.length > 1 ? (
      <b onClick={(e) => menu.handleClick(e)}>+ {models.length - 1} more...</b>
    ) : (
      <i />
    );
  return (
    <>
      <Typography variant="caption" color="text.secondary">
        <CostarMenu models={models} menu={menu} />
        <ModelName onClick={() => modelClicked(model.ID)} model={model} />
        {moreText}
      </Typography>
    </>
  );
}

const CostarMenu = ({ models, menu }) => {
  if (!models?.length) return <i />;
  const costars = models.slice(1);
  return (
    <Menu {...menu.menuProps}>
      {costars.map((costar) => (
        <MenuItem onClick={menu.handleClose(costar.ID)}>
          <StarAvatar
            mr={1}
            star={costar}
            openModel={menu.handleClose(costar.ID)}
          />
          {costar.Name}
        </MenuItem>
      ))}
    </Menu>
  );
};

const ModelName = ({ model, onClick }) => {
  if (!model.image) {
    return <em onClick={onClick}>{model.Name}</em>;
  }
  return (
    <Tooltip
      onClick={onClick}
      title={
        <Stack
          sx={{
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          {!!model.image && (
            <img
              src={model.image}
              alt={model.Name}
              style={{
                width: 160,
                aspectRatio: "2.1 / 3",
              }}
            />
          )}{" "}
          <Typography variant="caption" sx={{ color: "black" }}>
            {model.Name}
          </Typography>
        </Stack>
      }
    >
      <u onClick={onClick}>{model.Name}</u>
    </Tooltip>
  );
};
