function shortId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

export default function reducer(state: any, action: any) {  
    switch (action.type) {
      case "add_row":
        return {
          ...state,
          skipReset: true,
          data: [...state.data, {}]
        };
      case "update_column_header":
        const index = state.columns.findIndex(
          (column: any) => column.id === action.columnId
        );
        return {
          ...state,
          skipReset: true,
          columns: [
            ...state.columns.slice(0, index),
            { ...state.columns[index], label: action.label },
            ...state.columns.slice(index + 1, state.columns.length)
          ]
        };
      case "update_cell":
        return {
          ...state,
          skipReset: true,
          data: state.data.map((row: any, index: number) => {
            if (index === action.rowIndex) {
              return {
                ...state.data[action.rowIndex],
                [action.columnId]: action.value
              };
            }
            return row;
          })
        };
      case "add_column_to_left":
        const leftIndex = state.columns.findIndex(
          (column: any) => column.id === action.columnId
        );
        let leftId = shortId();
        return {
          ...state,
          skipReset: true,
          columns: [
            ...state.columns.slice(0, leftIndex),
            {
              id: leftId,
              label: "Column",
              accessor: leftId,
              dataType: "text",
              created: action.focus && true,
              options: []
            },
            ...state.columns.slice(leftIndex, state.columns.length)
          ]
        };
      case "add_column_to_right":
        const rightIndex = state.columns.findIndex(
          (column: any) => column.id === action.columnId
        );
        const rightId = shortId();
        return {
          ...state,
          skipReset: true,
          columns: [
            ...state.columns.slice(0, rightIndex + 1),
            {
              id: rightId,
              label: "Column",
              accessor: rightId,
              dataType: "text",
              created: action.focus && true,
              options: []
            },
            ...state.columns.slice(rightIndex + 1, state.columns.length)
          ]
        };
      case "delete_column":
        const deleteIndex = state.columns.findIndex(
          (column: any) => column.id === action.columnId
        );
        return {
          ...state,
          skipReset: true,
          columns: [
            ...state.columns.slice(0, deleteIndex),
            ...state.columns.slice(deleteIndex + 1, state.columns.length)
          ]
        };
      case "enable_reset":
        return {
          ...state,
          skipReset: false
        };
      default:
        return state;
    }
  }