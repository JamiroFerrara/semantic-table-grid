/**
 *
 * TableBody
 *
 */

/*

TODO set height with css?

table ,tr td{
    border:1px solid red
}
tbody {
    display:block;
    height:50px;
    overflow:auto;
}
thead, tbody tr {
    display:table;
    width:100%;
    table-layout:fixed; even columns width , fix width of table too
  }
  thead {
      width: calc( 100% - 1em ) scrollbars is average 1em/16px width, remove it from thead width 
  }
  table {
      width:400px;
  }

*/

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Table, Checkbox } from "semantic-ui-react";
import SortableTableRow from "./sortableTableRow";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const TableBody = (props) => {
  const {
    elements,
    columns,
    selectIsActive,
    onSelect,
    onDeselect,
    isSelected,
    emptyResults,
    columnsNumber,
    rowClassKey,
    rowUniqueKey,
    canDrag,
  } = props;

  const [dragKeyElements, setDragKeyElements] = useState({});

  useEffect(() => {
    if (Object.keys(canDrag).length > 0 && canDrag.isDraggable === true) {
      if (elements.length > 0) {
        const dragObject = generateDragKeyList();
        setDragKeyElements(dragObject);
      }
    }
  }, [elements]);

  const generateDragKeyList = () => {
    const keyList = [];
    const newElementsList = elements.map((e, i) => {
      keyList.push(i.toString());
      return { ...e, key: i.toString() };
    });
    return { dragCtxKeyList: keyList, draggableElements: newElementsList };
  };

  const innerDragEndHandler = (e) => {
    const { active, over } = e;

    if(over && active.id !== over.id) {
      setDragKeyElements((prevObj) => {
        const oldIndex = prevObj.dragCtxKeyList.indexOf(active.id);
        const newIndex = prevObj.dragCtxKeyList.indexOf(over.id);

        const newKeyList = arrayMove(prevObj.dragCtxKeyList, oldIndex, newIndex);
        const newElementList = arrayMove(
          prevObj.draggableElements,
          oldIndex,
          newIndex
        );

        return {
          dragCtxKeyList: newKeyList,
          draggableElements: newElementList,
        };
      });

      if (canDrag.handleDragEnd) canDrag.handleDragEnd(e);
    }
  };

  return (
    <Table.Body as={elements ? "tbody" : "div"}>
      {elements && elements.length > 0 ? (
        canDrag &&
        Object.keys(canDrag).length > 0 &&
        canDrag.isDraggable === true &&
        Object.keys(dragKeyElements).length > 0 ? (
          <DndContext onDragEnd={innerDragEndHandler}>
            <SortableContext
              items={dragKeyElements.dragCtxKeyList}
              strategy={verticalListSortingStrategy}
            >
              {dragKeyElements.draggableElements.map((element) => (
                <SortableTableRow
                  key={element.key}
                  element={element}
                  columns={columns}
                  selectIsActive={selectIsActive}
                  rowClassKey={rowClassKey}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          elements.map((element, index) => (
            <Table.Row
              key={rowUniqueKey ? element[rowUniqueKey] : index}
              className={rowClassKey ? element[rowClassKey] : null}
            >
              {selectIsActive ? (
                <Table.Cell collapsing>
                  <Checkbox
                    checked={Boolean(element[isSelected])}
                    onClick={() =>
                      element[isSelected]
                        ? onDeselect(element)
                        : onSelect(element)
                    }
                    slider={false}
                  />
                </Table.Cell>
              ) : null}
              {columns.map((column) =>
                column.formatter ? (
                  <Table.Cell key={column.key} {...column.options}>
                    {column.formatter({
                      value: element[column.key],
                      data: element,
                    })}
                  </Table.Cell>
                ) : (
                  <Table.Cell key={column.key}>
                    {element[column.key] !== undefined
                      ? element[column.key]
                      : null}
                  </Table.Cell>
                )
              )}
            </Table.Row>
          ))
        )
      ) : (
        <Table.Row style={{ width: "100%" }}>
          <Table.Cell colSpan={columnsNumber}>{emptyResults}</Table.Cell>
        </Table.Row>
      )}
    </Table.Body>
  );
};

TableBody.propTypes = {
  /**
   * Array of elements to fill the grid
   */
  elements: PropTypes.array,
  /**
   * Array of columns [{key: string, name: string, formatter: function, sortable, bool}]
   */
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /**
   * Show/Hide checkbox for selection
   */
  selectIsActive: PropTypes.bool,
  /**
   * Select handler
   */
  onSelect: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * Deselect handler
   */
  onDeselect: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * Selected flag
   */
  isSelected: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**
   * Draggable obj
   */
  canDrag: PropTypes.object,
};

export default TableBody;
