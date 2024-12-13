/**
 *
 * Sortable TableRow
 *
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSortable } from "@dnd-kit/sortable";
import { Table, Checkbox } from "semantic-ui-react";
import { CSS } from "@dnd-kit/utilities";

const SortableTableRow = ({
  element,
  columns,
  selectIsActive,
  rowClassKey,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: element.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    setNodeRef;
  }, [element]);

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={rowClassKey ? rowClassKey : undefined}
    >
      {selectIsActive ? (
        <Table.Cell collapsing>
          <Checkbox
            checked={Boolean(element[isSelected])}
            onClick={() =>
              element[isSelected] ? onDeselect(element) : onSelect(element)
            }
            slider={false}
          />
        </Table.Cell>
      ) : null}
      {(columns || []).map((column) =>
        column.isDrag ? (
          <td
            className="draggable"
            key={column.key}
            style={{
              cursor: "grab",
            }}
            ref={setActivatorNodeRef}
            {...listeners}
          >
            {column.formatter({
              value: element[column.key],
              data: element,
            })}
          </td>
        ) : column.formatter ? (
          <Table.Cell key={column.key} {...column.options}>
            {column.formatter({
              value: element[column.key],
              data: element,
            })}
          </Table.Cell>
        ) : (
          <Table.Cell key={column.key}>
            {element[column.key] !== undefined ? element[column.key] : null}
          </Table.Cell>
        )
      )}
    </tr>
  );
};

SortableTableRow.propTypes = {
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
   * Node dragging reference
   */
  dragggingKey: PropTypes.string,
};

export default SortableTableRow;
