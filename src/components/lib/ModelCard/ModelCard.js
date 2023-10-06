import React from "react";
import { Card, Typography, CardMedia, CardContent, Badge } from "@mui/material";
import { ERR_IMAGE } from "../../../const";

const ModelCard = ({ model, small, modelClicked }) => {
  const size = small ? 140 : 216;

  const [src, setSrc] = React.useState(ERR_IMAGE);

  const loadModel = React.useCallback(() => {
    if (!model.image) {
      return setSrc(ERR_IMAGE);
    }
    const im = new Image();
    im.onerror = () => setSrc(ERR_IMAGE);
    im.onload = () => setSrc(model.image);
    im.src = model.image;
  }, [model]);

  React.useEffect(() => {
    !!model && loadModel();
  }, [model, loadModel]);

  return (
    <Badge color="secondary" badgeContent={model.VideoCount}>
      <Card
        onClick={() => modelClicked && modelClicked(model.ID)}
        sx={{ cursor: "pointer", width: size }}
      >
        <CardMedia
          component="img"
          sx={{ borderRadius: 2, width: size - 16, aspectRatio: "2.1 / 3" }}
          width="100%"
          height="auto"
          image={src}
          alt={model.name}
        />
        <CardContent sx={{ p: (t) => t.spacing(1) + " !important" }}>
          {/* {JSON.stringify(Object.keys(model))} */}
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              fontWeight: 600,
              textOverflow: "ellipsis",
              overflow: "hidden",
              width: "100%",
            }}
            color="text.primary"
          >
            {model.name || model.Name}
          </Typography>
        </CardContent>
      </Card>
    </Badge>
  );
};
ModelCard.defaultProps = {};
export default ModelCard;
