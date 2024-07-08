import { ReactNode, useState, useEffect } from "react";
import { usePopper } from "react-popper";
import PlusIcon from "src/components/svg/Plus";
import HeaderPopup from "src/components/table/HeaderPopup";

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
  column: {id, created: createdJustNow, label, getResizerProps, getHeaderProps},
  setSortBy,
  dataDispatch
} : HeaderProps) : ReactNode => {
  const [isPopupExpanded, setIsPopupExpanded] = useState(createdJustNow || false);
  
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const {styles, attributes} = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy: "absolute"
  });

  useEffect(() => {
    if (createdJustNow) {
      setIsPopupExpanded(true);
    }
  }, [createdJustNow]);

  return id !== 999999 ? (
    <>
      <div {...getHeaderProps()} className='th noselect'>
        <div className='th-content' onClick={() => setIsPopupExpanded(true)} ref={setReferenceElement}>
          {label}
        </div>
        <div {...getResizerProps()} className='resizer' />
      </div>
      <HeaderPopup 
        isExpanded={isPopupExpanded} 
        setIsExpanded={setIsPopupExpanded}
        column={{id, label}}
        setSortBy={setSortBy}
        dataDispatch={dataDispatch}
        setPopperElement={setPopperElement}
        popper={{styles, attributes}}
      />
    </>
  ) : (
    <div {...getHeaderProps()} className='th table-noselect'>
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