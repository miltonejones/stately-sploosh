import React from "react";
import { Pagination, Typography } from "@mui/material";
import { Flex, Nowrap, Spacer } from "../../../styled";
import { useMenu } from "../../../machines";
import PromptDialog from "../PromptDialog/PromptDialog";

export default function ExPagination({ setPage, ...props }) {
  const menu = useMenu((num) => !!num && setPage(false, num));
  return (
    <>
      {" "}
      <Flex sx={{ p: 1 }}>
        <Pagination {...props} onChange={(_, num) => setPage(false, num)} />
        {/* <Typography
          hover
          variant="caption"
          sx={{ m: 1 }}
          value={props.page}
          onClick={(e) => {
            menu.handleClick(e, props.page); 
          }}
        > */}
        <i
          onClick={(e) => {
            menu.handleClick(e, props.page);
          }}
          className="fa-regular fa-file-lines"
        ></i>
        {/* </Typography> */}
        <Spacer />
      </Flex>
      <PromptDialog title="Go to page" menu={menu} />
    </>
  );
}
