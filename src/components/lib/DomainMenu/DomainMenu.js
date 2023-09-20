import React from "react";
import {
  Chip,
  MenuItem,
  Stack,
  TextField,
  Menu,
  Link,
  Typography,
} from "@mui/material";
import { Nowrap } from "../../../styled";

function addOrRemoveStringFromArray(arr, str) {
  const index = arr.indexOf(str);

  if (index !== -1) {
    arr.splice(index, 1);
  } else {
    arr.push(str);
  }

  return arr;
}

/*
 * The DomainMenu component renders a row of chips representing different domains
 * that the user can select to search for. If there are more than 4 domains, the first
 * 4 are shown as chips and the remaining domains are shown in a dropdown. It takes in
 * the following props:
 * - navigate: a function for navigating to a different page
 * - domains: an object containing the different domains to display
 * - domain: a string representing the currently selected domain(s)
 * - search_param: a string representing the search parameter to use
 * - busy: a boolean indicating whether the component is currently busy
 */
export default function DomainMenu({
  navigate,
  domains,
  domain,
  search_param,
  busy,
}) {
  // Determine which domains to display as chips and which to display in the dropdown
  const [selectedDomains, dropdownDomains] = Object.keys(domains).reduce(
    ([selected, dropdown], domainName, index) => {
      if (index < 6) {
        return [[...selected, domainName], dropdown];
      } else {
        return [selected, [...dropdown, domainName]];
      }
    },
    [[], []]
  );

  const [menuAnchor, setMenuAnchor] = React.useState();

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.target);
  };

  // Keep track of the selected domains in the dropdown
  // const [dropdownSelection, setDropdownSelection] = useState(
  //   domain?.split(",")
  // );
  const dropdownSelection = (!domain ? [] : domain.split(",")).filter(
    (f) => selectedDomains.indexOf(f) < 0
  );
  /*
   * Whenever a chip is clicked, this function is called with the name of the domain
   * that was clicked. It constructs a new URL and navigates to the search page with
   * the selected domain as a prefix.
   */
  const handleChipClick = (domainName) => {
    const prefix = domain ? domain.split(",").concat(domainName) : [domainName];
    const url = `/search/1/${search_param}/${prefix.join(",")}`;
    navigate(url);
  };

  /*
   * Whenever a chip's delete button is clicked, this function is called with the name
   * of the domain that was deleted. It constructs a new URL and navigates to the search
   * page without the deleted domain.
   */
  const handleChipDelete = (domainName) => {
    if (!domain || domain.indexOf(domainName) < 0) {
      // If the deleted domain was not selected, just navigate to the search page
      navigate(`/search/1/${search_param}`);
    } else {
      // Otherwise, construct a new prefix without the deleted domain
      const prefix = domain
        .split(",")
        .filter((name) => name !== domainName)
        .join(",");
      const url = `/search/1/${search_param}/${prefix}`;
      navigate(url);
    }
    handleMenuClose();
  };

  /*
   * Whenever a domain is selected in the dropdown, this function is called with
   * the selected domain(s). It updates the selected domains in the dropdown state.
   */
  const handleDropdownChange = (event) => {
    const { value } = event.target;
    // alert(typeof value);
    // alert(JSON.stringify({ dropdownSelection }, 0, 2));
    // alert(value);
    const sel = addOrRemoveStringFromArray(domain.split(","), value);
    handleDropdownClose([...new Set(sel)]);
  };

  /*
   * Whenever the dropdown is closed, this function is called. It constructs a
   * new URL and navigates to the search page with the selected domains as a prefix.
   */
  const handleDropdownClose = (sel) => {
    const url = `/search/1/${search_param}/${sel.join(",")}`;
    navigate(url);
    handleMenuClose();
  };

  const Component = !!dropdownSelection.length ? TextField : Menu;

  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        alignItems: "center",
        maxWidth: "90vw",
        overflow: "hidden",
        pt: 1,
      }}
    >
      {/* <Typography variant="caption">Domains</Typography> */}
      {selectedDomains.map((domainName) => (
        <Chip
          key={domainName}
          size="small"
          variant="filled"
          color={
            !domain || domain.indexOf(domainName) < 0 ? "default" : "success"
          }
          label={domainName}
          onClick={() => handleChipClick(domainName)}
          onDelete={() => handleChipDelete(domainName)}
          disabled={busy}
        />
      ))}

      {!dropdownSelection?.length && (
        <Nowrap
          hover
          variant="caption"
          onClick={handleMenuOpen}
          disabled={busy}
          sx={{ cursor: "pointer" }}
        >
          More Domains
        </Nowrap>
      )}

      {dropdownDomains.length > 0 && (
        <Component
          size="small"
          label="More Domains"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          select
          value=""
          sx={{ minWidth: 300, m: 2 }}
          InputProps={{
            startAdornment: (
              <ChipList
                selected={dropdownSelection}
                handleChipDelete={handleChipDelete}
              />
            ),
          }}
        >
          {dropdownDomains.map((domainName) => (
            <MenuItem
              onClick={() =>
                handleDropdownChange({
                  target: {
                    value: domainName,
                  },
                })
              }
              key={domainName}
              value={domainName}
            >
              {domainName}
            </MenuItem>
          ))}
        </Component>
      )}
    </Stack>
  );
}

function ChipList({ handleChipDelete, selected }) {
  return (
    <Stack spacing={1} direction="row">
      {selected.map((sel) => (
        <Chip
          size="small"
          label={sel}
          key={sel}
          color="success"
          onClick={() => handleChipDelete(sel)}
          onDelete={() => handleChipDelete(sel)}
        />
      ))}
    </Stack>
  );
}
