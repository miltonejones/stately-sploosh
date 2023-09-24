import React from "react";
import { Pagination } from "@mui/material";
import { Flex, Nowrap } from "../../../styled";
import { useMenu } from "../../../machines";
import PromptDialog from "../PromptDialog/PromptDialog";

export default function ExPagination({ setPage, ...props }) {
  const menu = useMenu((num) => !!num && setPage(false, num));
  return (
    <>
      {" "}
      <Flex>
        <Nowrap sx={{ minWidth: 400 }}>
          <Pagination {...props} onChange={(_, num) => setPage(false, num)} />
        </Nowrap>
        <Nowrap
          hover
          variant="caption"
          sx={{ m: 1 }}
          value={props.page}
          onClick={(e) => {
            menu.handleClick(e, props.page);
            // const num = prompt("Got to page", props.page);
            // !!num && setPage(false, num);
          }}
        >
          Set page
        </Nowrap>
      </Flex>
      <PromptDialog title="Go to page" menu={menu} />
    </>
  );
}
