/**
*
* TableAction
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { Table, Menu } from 'semantic-ui-react';

/**
 * DataTable custom action.
 */
const TableAction = (props) => {
  const { paginateIsActive, columnsNumber, page, pageCount, onSelect, pageMax, render, isEnabled } = props;

  const numberOfPageToShow = pageMax || pageCount;
  const limitIsActive = (numberOfPageToShow && (pageCount > numberOfPageToShow)) ? true : false;
  return (
    isEnabled ?
      <Table.Row>
        {paginateIsActive && <Table.HeaderCell key="table-action-paginate-active" colSpan={columnsNumber}>

          {!render && <Menu floated="right" pagination>
            {[...Array(numberOfPageToShow)].map((_e, index) => <Menu.Item key={`table-action-${index}`} onClick={() => onSelect(index + 1) || null} as="a" active={Boolean(page === (index + 1))} >{index + 1}</Menu.Item>)}
            {limitIsActive && <Menu.Item key="pageLimit1" as="a" active={false} >...</Menu.Item>}
          </Menu>}
          {render}
        </Table.HeaderCell>}

      </Table.Row> : null
  );
};

TableAction.propTypes = {
  /**
  * Show pagination
  */
  paginateIsActive: PropTypes.bool,
  /**
  * Numbers of column
  */
  columnsNumber: PropTypes.number,
  /**
  * Current page number
  */
  page: PropTypes.number,
  /**
  * Total pages
  */
  pageCount: PropTypes.number,
  /**
  * Select handler
  */
  onSelect: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]),
  /**
    * Page limit.
    * If the pages are more than the limit, show a limiter (3 dot) used to
    * make understandable to the user the reaching of a limit of visible results.
    * This is a "first version" of a probably more standard and reliable "round pagination"
    */
  pageMax: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  /**
   * Handle if the component render
  */
  isEnabled: PropTypes.bool,
  /**
   * Render, when render is active, all the props above are ignored
   */
  render: PropTypes.node,
};

export default TableAction;
