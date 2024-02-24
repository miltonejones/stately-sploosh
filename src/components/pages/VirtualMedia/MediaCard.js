import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions, Collapse, IconButton, Tooltip } from "@mui/material";
import { Flex, Nowrap } from "../../../styled";
import TooltipLink from "./TooltipLink";

const MediaCard = ({ data, fixed, getModel, setParam, stars }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card>
      <CardHeader
        title={
          <Tooltip title={data.title || "No title"}>
            <Typography variant="body2">{data.title || "No title"}</Typography>
          </Tooltip>
        }
        subheader={
          <Nowrap
            muted={!data.studio}
            variant="caption"
            hover={!!data.studio}
            onClick={() => !!data.studio && setParam(data.studio)}
          >
            Studio: {data.studio || "none"}
          </Nowrap>
        }
      />
      <CardMedia
        component="img"
        height="150"
        image={data.photoURL}
        alt={data.title}
      />

      {!!data.info?.title && (
        <CardContent>
          {" "}
          <Tooltip title={data.info.title}>
            <Typography
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              className={fixed ? "anchor fixed" : "anchor"}
              variant="caption"
              color={"text.secondary"}
            >
              {data.info.title}
            </Typography>
          </Tooltip>
        </CardContent>
      )}

      {/* <CardContent>{data.info?.title}</CardContent> */}
      <CardActions disableSpacing>
        <Flex spacing={2}>
          <i
            onClick={() => window.open(data.videoURL)}
            className="fa-solid fa-up-right-from-square"
          ></i>

          {/* <IconButton aria-label="add to favorites">
          < />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
          {!!data.info?.stars?.length && (
            <>
              <TooltipLink
                stars={stars}
                first={data.info.stars[0]}
                getModel={getModel}
                setParam={setParam}
              />
              {data.info.stars.length > 1 && (
                <i
                  class="fa-solid fa-chevron-down"
                  onClick={handleExpandClick}
                ></i>
              )}
            </>
          )}
        </Flex>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {!!data.info?.stars && (
          <CardContent>
            {data.info.stars.map((s) => (
              <TooltipLink
                stars={stars}
                first={s}
                getModel={getModel}
                setParam={setParam}
              />
            ))}
          </CardContent>
        )}
      </Collapse>
    </Card>
  );
};

export default MediaCard;
