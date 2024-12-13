/**
*
* TableToolbar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Table, Menu, Button, Icon } from 'semantic-ui-react';


/**
 * DataTable footer.
 */
const TableToolbar = props => {
  const { columnsNumber, deleteAction, newAction, deleteLabel, newLabel, selectIsActive, elements } = props;
  const checkIsSelected = (elements) => {
    return _(elements).filter({ isSelected: true }).size();
  }

  return (
    <Table.Header fullWidth>
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell colSpan={columnsNumber}>
          <Button
            floated="right"
            icon
            labelPosition="left"
            primary
            size="small"
            onClick={newAction}
          >
            <Icon name="plus" /> {newLabel ? newLabel : 'Nuovo'}
          </Button>
          {selectIsActive &&
            <Button size="small"
              labelPosition="left"
              icon
              negative
              onClick={deleteAction}
              disabled={checkIsSelected(elements) == 0}
            >
              <Icon name="remove" />
              {deleteLabel ? deleteLabel : 'Elimina'}
            </Button>
          }
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};


TableToolbar.propTypes = {
  /**
  * Numbers of column
  */
  columnsNumber: PropTypes.number,
  /**
   * New action
  */
  newAction: PropTypes.func,
  /**
   * Mass delete action
  */
  deleteAction: PropTypes.func,
  /**
   * Label for 'New' button 
  */
  newLabel: PropTypes.string,
  /**
   * Label for 'Delete' button
   */
  deleteLabel: PropTypes.string,
  /**
 * Show/Hide checkbox for selection
 */
  selectIsActive: PropTypes.bool,
  /**
 * Elements to manage
 */
  elements: PropTypes.array,
};

export default TableToolbar;
