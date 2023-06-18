import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled as matStyled } from "@mui/material/styles";
import { Button, IconButton } from "@mui/material";
import styled from "styled-components";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import Switch from "@mui/material/Switch";
import { useHistory } from "react-router-dom";
import slug from "slug";

const StyledTableCell = matStyled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "red",
    color: "white"
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = matStyled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function descendingComparator(a, b, orderBy) {
  if (orderBy === "created") {
    const a_date = new Date(a[orderBy]);
    const b_date = new Date(b[orderBy]);

    if (b_date < a_date) {
      return -1;
    }
    if (b_date > a_date) {
      return 1;
    }
    return 0;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  {
    id: "index",
    numeric: true,
    disablePadding: false,
    label: "S.No."
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "Character Name"
  },
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Character Owner"
  },
  {
    id: "updatedAt",
    numeric: true,
    disablePadding: false,
    label: "Last Modified"
  },
  {
    id: "currentStatus",
    numeric: true,
    disablePadding: false,
    label: "Status"
  },
  {
    id: "weight",
    numeric: true,
    disablePadding: false,
    label: "Weight"
  },
  {
    id: "viewForm",
    numeric: true,
    disablePadding: false,
    label: "Navigate"
  },

  {
    id: "action",
    numeric: true,
    disablePadding: false,
    label: "Action Btns"
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              disabled={headCell.id === "output"}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

export const EnhancedTable = props => {
  const history = useHistory();

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("created");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [plansList, setPlansList] = React.useState([]);
  const [selectedPlan, setSelectedPlan] = React.useState("All");
  const [filteredPlansList, setFilteredPlansList] = React.useState([
    ...props.rows
  ]);

  useEffect(() => {
    const uniquePlanNames = [...new Set(props.rows.map(item => item.planName))];
    setPlansList(["All", ...uniquePlanNames]);
  }, []);

  const handlePlanChange = event => {
    const newList = props.rows.map(item => event.target.value);
    setSelectedPlan(event.target.value);
    setFilteredPlansList([...newList]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelected = props.rows.map(n => n.name);
      setSelected([newSelected]);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    props.handleChangePage(newPage, rowsPerPage, () => {
      setPage(newPage);
    });
  };

  const handleChangeRowsPerPage = event => {
    props.handleChangePage(0, event.target.value, () => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    });
  };

  const handleEditClick = id => {
    localStorage.removeItem("service_id");
    history.push(`create/${id}`);
  };

  const handleClick = (name, id) => {
    history.push(`/chat/${slug(name)}/${id}`);
  };

  return (
    <>
      <DesktopWrapper>
        <Box sx={{ width: "100%" }}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={props.rows.length}
                />
                <TableBody>
                  {stableSort(props.rows, getComparator(order, orderBy)).map(
                    (row, index, array) => {
                      console.log("row", row);
                      return (
                        <StyledTableRow
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {index + 1}
                          </StyledTableCell>

                          <StyledTableCell
                            component="th"
                            scope="row"
                            align="center"
                          >
                            {row?.characterName || "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row?.characterOwnerName || "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row?.updatedAt || "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row?.isDraft
                              ? "Draft"
                              : row?.isLocked
                              ? "Locked"
                              : "Live"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row?.characterWeight || "NA"}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleClick(row?.characterName, row?.id)
                              }
                            >
                              View Character
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <IconButton
                              aria-label="delete"
                              color="primary"
                              onClick={() => handleEditClick(row.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </IconButton>
                            <Switch
                              checked={!row?.isDraft}
                              onChange={() => props.handleSwitchChange(row.id)}
                            />
                            {row?.isLocked ? (
                              <IconButton
                                onClick={() =>
                                  props.handleLockClick(row.id, "unlock")
                                }
                                aria-label="delete"
                                color="primary"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                  />
                                </svg>
                              </IconButton>
                            ) : (
                              <IconButton
                                aria-label="delete"
                                color="primary"
                                onClick={() =>
                                  props.handleLockClick(row.id, "lock")
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                  />
                                </svg>
                              </IconButton>
                            )}

                            <IconButton
                              aria-label="delete"
                              color="primary"
                              onClick={() =>
                                props.handleDeleteClick(row.id, "lock")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </IconButton>

                            {/* {row?.currentStatus || "NA"} */}
                          </StyledTableCell>
                          {/* <StyledTableCell align="center">
                            {row?.currentStatus || 'NA'}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.planCount ? (
                              <Button
                                variant="outlined"
                                onClick={() => handleClick(row.id)}
                              >
                                View Form
                              </Button>
                            ) : (
                              "No Plans"
                            )} 
                          </StyledTableCell>*/}
                        </StyledTableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={props.count}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </DesktopWrapper>
      <MobileWrapper>
        <div className="header">
          <h1>Plans</h1>
          <div className="filters">
            <span>
              Total <span className="value">{filteredPlansList.length}</span>
            </span>
            <span class="updatePlanName">
              Show{" "}
              <span className="value">
                <FormControl variant="standard" sx={{ m: 1, minWidth: 140 }}>
                  <StyledSelect
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={selectedPlan}
                    onChange={handlePlanChange}
                    MenuProps={{
                      sx: {
                        "& .MuiListItem-root.Mui-selected": {
                          backgroundColor: "transparent"
                        }
                      }
                    }}
                  >
                    {plansList.map((value, index) => {
                      return (
                        <StyledMenuItem
                          value={value}
                          MenuProps={{
                            sx: {
                              "&& .Mui-selected": {
                                background: "#f9f9f9",
                                color: "#05bbc2"
                              }
                            }
                          }}
                        >
                          {value}
                        </StyledMenuItem>
                      );
                    })}
                  </StyledSelect>
                </FormControl>
              </span>
            </span>
          </div>
        </div>
        {filteredPlansList.map(
          (
            { created, credits, planName, output, api, planFormFields },
            index
          ) => {
            return (
              <CardContainer>
                <div className="left">
                  <div>
                    <div>
                      Name:
                      <span className="value">
                        {` Plannr_${props.count - index}`}
                      </span>
                    </div>
                    <div>
                      Credits Used: <span className="value">{credits}</span>
                    </div>
                  </div>
                  <div>
                    <span>{created}</span>
                  </div>
                </div>
                <div className="right">
                  <div className="value">{planName}</div>
                  <Button
                    variant="outlined"
                    // onClick={() => handleClick(output, api, planFormFields)}
                  >
                    {/* View Plan */}
                  </Button>
                </div>
              </CardContainer>
            );
          }
        )}
      </MobileWrapper>
    </>
  );
};

const StyledMenuItem = styled(MenuItem)`
  font-style: normal;
  font-size: 16px;
  line-height: 38px;
  padding: 3px 22px;
`;

const StyledSelect = styled(Select)`
  #demo-simple-select-standard {
    display: flex;
    justify-content: space-evenly;
    background-color: transparent !important;
    /* color:#00C4CC !important; */
  }
`;

const CardContainer = styled.div`
  padding: 16px;
  height: 134px;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  margin: 10px 0px;

  .left {
    flex: 0.5;
    display: flex;
    flex-direction: column;
    gap: 30px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  }

  .right {
    flex: 0.5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .value {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
    color: #344054;
  }
`;

const DesktopWrapper = styled.div`
  display: block !important;

  @media only screen and (max-width: 600px) {
    display: none !important;
  }
`;
const MobileWrapper = styled.div`
  display: none !important;
  .header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 16px;
    h1 {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 38px;
      color: #101828;
    }
    .filters {
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: center;
    }
    .value {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      text-align: right;
      color: #344054;
    }

    .updatePlanName {
      vertical-align: middle;
      display: flex;
      align-items: center;
    }
  }
  @media only screen and (max-width: 600px) {
    display: block !important;
  }
`;
