import { ReactNode, useState, useEffect } from "react";
import ArrowUpIcon from "src/components/svg/ArrowUp";
import ArrowDownIcon from "src/components/svg/ArrowDown";
import ArrowLeftIcon from "src/components/svg/ArrowLeft";
import ArrowRightIcon from "src/components/svg/ArrowRight";
import TrashIcon from "src/components/svg/Trash";

function shortId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

interface Column {
    id: number
    label: string
    [key: string]: any //TODO
}  

interface HeaderProps {
  isExpanded: Boolean
  setIsExpanded: Function
  column: Column
  setSortBy: Function
  dataDispatch: Function
  setPopperElement: Function
  popper: any
}

const HeaderPopup = ({
    isExpanded,
    setIsExpanded,
    column: {id: columnId, label: columnLabel}, 
    setSortBy, 
    dataDispatch,
    setPopperElement,
    popper: {styles, attributes}
} : HeaderProps) : ReactNode => {
  // const inputRef = useRef<HTMLInputElement>(null); <<<-----------------
  const [inputRef, setInputRef] = useState<any>(null);
  const [header, setHeader] = useState(columnLabel);

  const buttons = [
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId, label: header});
        setSortBy([{id: columnId, desc: false}]);
        setIsExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId, label: header});
        setSortBy([{id: columnId, desc: true}]);
        setIsExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId, label: header});
        dataDispatch({type: "add_column_to_left", columnId, focus: false});
        setIsExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId, label: header});
        dataDispatch({type: "add_column_to_right", columnId, focus: false});
        setIsExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId, label: header});
        dataDispatch({type: "delete_column", columnId});
        setIsExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete"
    }
  ];

  useEffect(() => {
    setHeader(columnLabel);
  }, [columnLabel]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      dataDispatch({type: "update_column_header", columnId, label: header});
      setIsExpanded(false);
    }
  }

  function handleChange(e: any) {
    setHeader(e.target.value);
  }

  function handleBlur(e: any) {
    e.preventDefault();
    dataDispatch({type: "update_column_header", columnId, label: header});
  }

  return <>
      {isExpanded && <div className='overlay' onClick={() => setIsExpanded(false)} />}
      {isExpanded && (
        <div ref={setPopperElement} style={{...styles.popper, zIndex: 3}} {...attributes.popper}>
          <div className='header-popup'>
            <div className='w-full' style={{marginBottom: 4, paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem"}}>
                <input
                    className='form-input'
                    ref={setInputRef}
                    type='text'
                    value={header}
                    style={{width: "100%"}}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div key={shortId()} className="header-popup-options">
              {buttons.map((button) => (
                <button key={button.label} className="header-popup-option" type='button' onMouseDown={button.onClick}>
                  <span className='header-popup-option-icon svg-icon'>{button.icon}</span>
                  <span className='header-popup-option-text'>{button.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
}

export default HeaderPopup;