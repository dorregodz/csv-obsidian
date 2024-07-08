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
    <div className="table-container-screen">
      <div className="table-container-flexbox">
        <div className="table-container">
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
