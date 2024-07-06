import { ReactNode, useState, useEffect } from "react";
import { usePopper } from "react-popper";
import ArrowUpIcon from "src/components/svg/ArrowUp";
import ArrowDownIcon from "src/components/svg/ArrowDown";
import ArrowLeftIcon from "src/components/svg/ArrowLeft";
import ArrowRightIcon from "src/components/svg/ArrowRight";
import TrashIcon from "src/components/svg/Trash";
import PlusIcon from "src/components/svg/Plus";

function shortId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

interface Column {
  id: number
  [key: string]: any //TODO
}

interface HeaderProps {
  column: Column
  setSortBy: Function
  dataDispatch: Function
}

const Header = ({
  column: {id, created, label, getResizerProps, getHeaderProps},
  setSortBy,
  dataDispatch
} : HeaderProps) : ReactNode => {
  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState<any>(null);
  const {styles, attributes} = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "absolute"
  });
  const [header, setHeader] = useState(label);

  const buttons = [
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId: id, label: header});
        setSortBy([{id: id, desc: false}]);
        setExpanded(false);
      },
      icon: <ArrowUpIcon />,
      label: "Sort ascending"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId: id, label: header});
        setSortBy([{id: id, desc: true}]);
        setExpanded(false);
      },
      icon: <ArrowDownIcon />,
      label: "Sort descending"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId: id, label: header});
        dataDispatch({type: "add_column_to_left", columnId: id, focus: false});
        setExpanded(false);
      },
      icon: <ArrowLeftIcon />,
      label: "Insert left"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId: id, label: header});
        dataDispatch({type: "add_column_to_right", columnId: id, focus: false});
        setExpanded(false);
      },
      icon: <ArrowRightIcon />,
      label: "Insert right"
    },
    {
      onClick: (e: any) => {
        dataDispatch({type: "update_column_header", columnId: id, label: header});
        dataDispatch({type: "delete_column", columnId: id});
        setExpanded(false);
      },
      icon: <TrashIcon />,
      label: "Delete"
    }
  ];

  useEffect(() => {
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      dataDispatch({type: "update_column_header", columnId: id, label: header});
      setExpanded(false);
    }
  }

  function handleChange(e: any) {
    setHeader(e.target.value);
  }

  function handleBlur(e: any) {
    e.preventDefault();
    dataDispatch({type: "update_column_header", columnId: id, label: header});
  }

  return id !== 999999 ? (
    <>
      <div {...getHeaderProps({style: {display: "inline-block"}})} className='th noselect'>
        <div className='th-content' onClick={() => setExpanded(true)} ref={setReferenceElement}>
          {label}
        </div>
        <div {...getResizerProps()} className='resizer' />
      </div>
      {expanded && <div className='overlay' onClick={() => setExpanded(false)} />}
      {expanded && (
        <div ref={setPopperElement} style={{...styles.popper, zIndex: 3}} {...attributes.popper}>
          <div className='header-popup'>
            <div style={{paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem"}}>
              <div className='w-full' style={{marginBottom: 4}}>
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
  ) : (
    <div {...getHeaderProps({style: {display: "inline-block"}})} className='th table-noselect'>
      <div
        className='th-content add-column'
        onClick={(e) => dataDispatch({type: "add_column_to_left", columnId: 999999, focus: true})}>
        <span className='svg-icon-sm svg-gray'>
          <PlusIcon />
        </span>
      </div>
    </div>
  );
}

export default Header;