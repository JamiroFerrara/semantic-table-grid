/**
*
* TableHeader
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { Table, Button, Icon, Checkbox } from 'semantic-ui-react';

/**
 * DataTable header.
 */
const TableHeader = (props) => {
  const {
    selectIsActive,
    elements,
    isSelected,
    sortIsActive,
    columns,
    sortColumn,
    sortDirection,
    changeSort,
    actionHeaderIsActive,
    actionHeaderActions,
    selectAll,
    onSelectAll,
    onDeselectAll,
    hiddenHeaderIfEmpty,
    paginateOnTop = null,
  } = props;

  const translatedState = (sortDirection !== 'none') ? (sortDirection === 'asc') ? 'ascending' : 'descending' : null;

  // hidden header, if not elements and if is set "hidden if empty"
  // TOFIX, length of null;
  const hiddenHeader = (elements.length <= 0 && hiddenHeaderIfEmpty);

  // look how many elements are active.
  const selectedElements = (elements.length) ? elements.filter((el) => el[isSelected] === true) : 0;
  const allSelected = (elements.length) ? Boolean(selectedElements.length === elements.length) : false;

  return (
    <Table.Header>
      {(actionHeaderIsActive) ?
        <Table.Row >
          <Table.HeaderCell  colSpan={columns ? columns.length + 1 : 1}>
            {actionHeaderActions}
          </Table.HeaderCell>
        </Table.Row>
        : null}
      {paginateOnTop}
      <Table.Row>
        {(selectIsActive && !hiddenHeader) ?
          <Table.HeaderCell  key={'semanticTableGrid.selectable.header'} >
            {selectAll && <Checkbox checked={allSelected} onClick={() => (onDeselectAll && onSelectAll) ? (allSelected) ? onDeselectAll() : onSelectAll() : null} />}
          </Table.HeaderCell >
          : null}
        {Array.isArray(columns) && !hiddenHeader && columns.map((column) =>
          <Table.HeaderCell
            key={column.key}
            onClick={() => (typeof column.name === 'string' && sortIsActive && (!column.sortable === false)) ? changeSort(column.key) : null}
            sorted={(typeof column.name === 'string' && sortIsActive) ? (sortColumn === column.key) ? translatedState : null : null}
            style={{ width: column.width || 'auto' }}
          >
          {column.name}
          {typeof column.name === 'string' && sortIsActive && (column.sortable === true) && ((sortColumn !== column.key) || translatedState === null) ? <Icon name="sort" style={{ color: 'lightgrey', paddingLeft: '2%' }}/> : ''}
          </Table.HeaderCell>
        )}
      </Table.Row>
    </Table.Header >);
};


TableHeader.propTypes = {
  /**
   * Select enabled/disabled
   */
  selectIsActive: PropTypes.bool,
  /**
   * Sort enabled/disabled
   */
  sortIsActive: PropTypes.bool,
  /**
   * Array of columns [{ key: 'keyString', name: 'nameString', sortable: bool, width: '50px' , formatter: [function(value,data)]}, {...}, ...]
   */
  columns: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  /**
   * Column to sort
   */
  sortColumn: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  /**
   * Sort direction of selected column
  */
  sortDirection: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  /**
   * Function to cycle through sorting orders (ASC, DESC, NONE)
  */
  changeSort: PropTypes.func,
  /**
   * A component pagination if position of paginator is 'top' or 'both'
   */
  paginateOnTop: PropTypes.node,
};

export default TableHeader;
