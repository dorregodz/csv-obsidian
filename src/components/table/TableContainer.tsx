import { useEffect, useReducer } from "react";
import "../../../styles.css";
import Table from "./Table";
import reducer from "src/components/state/tableReducer";

function TableContainer({data} : {data: Array<object>}) {
  const columns : Array<any> = Object.keys(data[0]).map(key => ({
    id: key,
    label: key,
    accessor: key
  }))
  columns.push({
    id: 999999,
    width: 20,
    label: "+",
    disableResizing: true
  });

  const [state, dispatch] = useReducer(reducer, {columns, data, skipReset: false});

  useEffect(() => {
    dispatch({ type: "enable_reset" });
  }, [state.data, state.columns]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflowX: "hidden"
      }}
    >
      <div style={{ overflow: "auto", display: "flex" }}>
        <div
          style={{
            flex: "1 1 auto",
            padding: "1rem",
            maxWidth: 1000,
            marginLeft: "auto",
            marginRight: "auto"
          }}
        >
          <Table
            columns={state.columns}
            data={state.data}
            dispatch={dispatch}
            skipReset={state.skipReset}
          />
        </div>
      </div>
    </div>
  );
}

export default TableContainer;
