import { ReactNode, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";

interface Column {
  id: string
}

interface Row {
  index: number
}

interface CellProps {
  value: string
  row: Row
  column: Column
  dataDispatch: Function
}

const Cell = ({
  value: initialValue, 
  row: { index }, 
  column: { id },
  dataDispatch
} : CellProps) : ReactNode => {
  const [value, setValue] = useState({value: initialValue, update: false});
  const onChange = (e: any) => {
    setValue({value: e.target.value, update: false});
  };

  useEffect(() => {
    setValue({value: initialValue, update: false});
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({type: "update_cell", columnId: id, rowIndex: index, value: value.value});
    }
  }, [value, dataDispatch, id, index]);

  return <ContentEditable
      html={(value.value && value.value.toString()) || ""}
      onChange={onChange}
      onBlur={() => setValue((old) => ({value: old.value, update: true}))}
      className='data-input'
    />
}

export default Cell;
