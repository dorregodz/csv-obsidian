import { ReactNode } from "react";
import { useTable, useFlexLayout, useResizeColumns, useSortBy } from "react-table";
import Cell from "src/components/table/Cell";
import Header from "src/components/table/Header";
import PlusIcon from "src/components/svg/Plus";

const defaultColumn : any = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
};

interface TableProps {
  columns: Array<any>
  data: Array<any>
  dispatch: Function
}

const Table = ({columns, data, dispatch: dataDispatch} : TableProps) : ReactNode =>{
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable(
    {
      columns,
      data,
      defaultColumn,
      dataDispatch // Needed for passing it to the childs
    },
    useFlexLayout,
    useResizeColumns,
    useSortBy
  );

  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        const col : any = column
        if (col.isResizing) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <>
      <div {...getTableProps()} className={`table ${isTableResizing() ? "table-noselect" : ""}`}>
        <div>
          {headerGroups.map((headerGroup: any) => (
            <div {...headerGroup.getHeaderGroupProps()} className='tr'>
              {headerGroup.headers.map((column: any) => column.render("Header"))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          {rows.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className='tr'>
                {row.cells.map((cell: any) => (
                  <div {...cell.getCellProps()} className='td'>
                    {cell.render("Cell")}
                  </div>
                ))}
              </div>
            );
          })}
          <div className="t-foot-container">
            <div className='tr t-foot add-row' onClick={() => dataDispatch({type: "add_row"})}>
              <span className='svg-icon svg-gray' style={{marginRight: 4}}>
                <PlusIcon />
              </span>
              New
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;