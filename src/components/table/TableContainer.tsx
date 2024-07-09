import { useEffect, useReducer } from "react";
import Table from "./Table";
import reducer from "src/state/tableReducer";

function TableContainer({data, onSave} : {data: Array<object>, onSave: Function}) {
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

  const [state, dispatch] = useReducer(reducer, {columns, data});

  useEffect(() => {
    // @ts-ignore ts(2339)
    window.onSaveDzCsv = () => {
      onSave(state.data)
    }
  })

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
          />
        </div>
      </div>
    </div>
  );
}

export default TableContainer;
