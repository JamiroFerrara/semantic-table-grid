/**
 *
 * SemanticTableGrid
 *
 */

import React from "react";
import PropTypes from "prop-types";

import { Table, Loader, Dimmer } from "semantic-ui-react";

import TableHeaderGenerator from "./tableHeader";
import TableBodyGenerator from "./tableBody";
import TableFooterGenerator from "./tableFooter";
import TableToolbarGenerator from "./tableToolbar";
import TableActionGenerator from "./tableAction";

/**
 * Simple Grid based on Table markup, using SEMATIC-UI react components.
 *
 * This component in unmanaged.
 * So you should to pass and manage externally all your property except ORDER.
 * Order is set internally, in order to manage a Three State order (asc, desc, none) and make this part more clean
 * (In a future can be settable from props and this part will be unmanaged too)
 *
 */
class SemanticTableGrid extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    // console.log('initial props', props.canSort.sortParams);
    // TODO initialize form props;
    this.state = {
      sortColumn: false, // (props.canSort && props.sortParams.column) ? props.canSort.sortParams.column : false,
      sortDirection: false, // (props.canSort && props.sortParams.direction) ? props.canSort.sortParams.direction : false,
      isLoading: false,
    };
  }

  getSortDirection = (field) => {
    /**
     * filed already sorted, round sorting managing
     */
    if (field === this.state.sortColumn) {
      if (this.state.sortDirection === "asc") {
        return "desc";
      } else if (this.state.sortDirection === "desc") {
        return "none";
      }
      return "asc";
    }
    /**
     * New field, start with default order
     */
    return "asc";
  };
  render() {
    const {
      rawProps = null,
      unstackable = false,
      toolbar = false,
      deleteAction = null,
      newAction = null,
      elements = [],
      hiddenHeaderIfEmpty = false,
      emptyResults = null,
      columns = {},
      rowClassKey = false,
      rowUniqueKey = false,
      isLoading = false,
      canDrag = {},
      canSelect: {
        active: selectIsActive = false,
        onSelect: selectOnSelect = false,
        onDeselect: selectOnDeselect = false,
        selectAll = false,
        onSelectAll = false,
        onDeselectAll = false,
        isSelectedProperty = false,
      } = {},
      canSort: {
        active: sortIsActive = false,
        onSort = false, // function;
      } = {},
      canPaginate: {
        active: paginateIsActive = false,
        pageCount = 0,
        pageSize = 0,
        totalItems = 0,
        page = 1,
        onSelect: paginateOnSelect = false, // function;
        pageMax = false,
        render = false,
        componentsPosition = "bottom",
      } = {},
      canAction: {
        active: actionHeaderIsActive = false,
        actions: actionHeaderActions = [],
      } = {},
    } = this.props;

    const { sortColumn, sortDirection } = this.state;

    const tableCustomAction = (
      <TableActionGenerator
        paginateIsActive={paginateIsActive}
        columnsNumber={selectIsActive ? columns.length + 1 : columns.length}
        page={page}
        pageCount={pageCount}
        onSelect={paginateOnSelect}
        pageMax={pageMax}
        isEnabled={
          componentsPosition === "top" || componentsPosition === "both"
        }
        render={render}
      />
    );

    return (
      <div style={{ position: "relative" }}>
        <Dimmer active={isLoading} inverted>
          <Loader />
        </Dimmer>
        <Table sortable={sortIsActive} celled unstackable {...rawProps}>
          {toolbar && (
            <TableToolbarGenerator
              columnsNumber={
                selectIsActive ? columns.length + 1 : columns.length
              }
              selectIsActive={selectIsActive}
              elements={elements}
              deleteAction={deleteAction}
              newAction={newAction}
            />
          )}

          <TableHeaderGenerator
            elements={elements}
            selectIsActive={selectIsActive}
            isSelected={isSelectedProperty}
            selectAll={selectAll}
            onSelectAll={onSelectAll}
            onDeselectAll={onDeselectAll}
            sortIsActive={sortIsActive}
            changeSort={(field) => {
              const sortDirectionNext = this.getSortDirection(field);
              this.setState({
                sortColumn: sortDirectionNext ? field : false,
                sortDirection: sortDirectionNext,
              }); // TODO move this in the Class (field,cb)
              onSort(field, sortDirectionNext);
            }}
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            actionHeaderIsActive={actionHeaderIsActive}
            actionHeaderActions={actionHeaderActions}
            hiddenHeaderIfEmpty={hiddenHeaderIfEmpty}
            paginateOnTop={tableCustomAction}
          />

          <TableBodyGenerator
            elements={elements}
            emptyResults={emptyResults}
            columns={columns}
            rowClassKey={rowClassKey}
            rowUniqueKey={rowUniqueKey}
            selectIsActive={selectIsActive}
            onSelect={selectOnSelect}
            onDeselect={selectOnDeselect}
            isSelected={isSelectedProperty}
            columnsNumber={selectIsActive ? columns.length + 1 : columns.length}
            canDrag={canDrag}
          />
          <TableFooterGenerator
            paginateIsActive={paginateIsActive}
            columnsNumber={selectIsActive ? columns.length + 1 : columns.length}
            page={page}
            pageCount={pageCount}
            onSelect={paginateOnSelect}
            pageMax={pageMax}
            isEnabled={
              componentsPosition === "bottom" || componentsPosition === "both"
            }
            render={render}
          />
        </Table>
      </div>
    );
  }
}

SemanticTableGrid.propTypes = {
  /**
   * rawProps represent a object made of props
   * directly inputed to the semantic Table
   */
  rawProps: PropTypes.object,
  /**
   * Array of elements to fill the grid
   */
  elements: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  /**
   *  If ToolBar is enable
   */
  toolbar: PropTypes.bool,
  /**
   * function triggered when you click delete in the ToolBar
   */
  deleteAction: PropTypes.func,
  /**
   * function triggered when you click new in the ToolBar
   */
  newAction: PropTypes.func,
  /**
   * Loading state to show spinner
   */
  isLoading: PropTypes.bool,
  /**
    * Columns list ArrayOf Shape: 
    
    [
        { 
            key: string, // the key of the object, used to show the value
            name: node // it can receive react element, string to format the data
            formatter: function, // if is set, this function is used to format the data
            sortable: bool, // if true, you can sort this field
            width: string // set the width of the TH, if not set use auto
        }
    ]
    */
  columns: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.node,
        sortable: PropTypes.bool,
        formatter: PropTypes.func,
        width: PropTypes.string,
        isDrag: PropTypes.bool,
      })
    ),
  ]),
  /**
   * rowClassKey define the object property to used as "String" class for the entire row.
   */
  rowClassKey: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**
   * rowUniqueKey define the object property to used as React's Key props. It should be unique
   * Default is false. In this case, index of array is used, but it can be slow when reload or reorder
   */
  rowUniqueKey: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**
    *  Configuration for drag & drop

    canDrag: {
      isDraggable: boolean, // activate drag & drop functionality
      handleDragEnd: function, // callback to what will be executed when the dragging operation stops
    }

    NB: refer to the @dnd-kit library docs for more info

  */
  canDrag: PropTypes.object,
  /**
    *  Configuration for selecting rows

    canSelect: {
                active: boolean,
                onSelect: function, // function when Select an object,
                onDeselect: function, // function when Deselect an object,
                selectAll: boolean, // activate the "Select All checkbox"
                onSelectAll: function, // function to manage when Select All
                onDeselectAll: function, // function to manage when Deselect All,
                isSelectedProperty: string, // the name of the property used check if selected
            } 

    */
  canSelect: PropTypes.object,
  /**
    * Configuration for paginating

    canPaginate: {
                active: boolean,
                pageCount: Number, // Number of the Total pages,
                pageSize: Number, // Number of the objects in a single page,
                totalItems: Number, // Number of the Total elements,
                page: Number, // Actual page Number
                onSelect: function, // function triggered when you choose a page
                pageMax: boolean || number, // used to show the limit pagination, see the Props in the tableFooter for further infos
                render: node, //you can pass object instead internal pagination
                componentsPosition: enums,  // used to determine position of the pagination on the table. 
                                            // 3 values: 'top' will render only above the table header, 'bottom' will render only at the end of the table.
                                            // 'both' render on both table header and table footer
            }

    */
  canPaginate: PropTypes.object,
  /**
    * Configuration for sorting

    canSort: {
                active: boolean,
                onSort: function, // function triggered when you request to Sort clicking th of the columns
            }

    */
  canSort: PropTypes.object,
  /**
   * Boolean, if true the table header is hidden without result, default: false.
   */
  hiddenHeaderIfEmpty: PropTypes.bool,
  /**
   * Node printed When table have not results
   */
  emptyResults: PropTypes.node,
  /**
     * 
     * Configuration for header Buttons
     * 
       canAction: {
                active: Boolean,
                actions: array, // an array of Nodes,
          }
     * 
     */
  canAction: PropTypes.object,
};

export default SemanticTableGrid;
